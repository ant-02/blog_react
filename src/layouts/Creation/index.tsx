import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchArticleDTOsByUserIdAPI } from "../../apis/article";
import UploadButton from "../../components/UploadButton";
import { FloatingActionGroup } from "../../components/FloatingActionGroup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Rocket, Save, Trash2, Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { Flexbox } from "react-layout-kit";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import TurndownService from "turndown";
import Loading from "../../components/Loading";
import {
  Article,
  ArticleCreatePayload,
  ArticleStatus,
  ArticleUpdatePayload,
} from "../../models/article";
import {
  useCreateArticleMutation,
  useGetArticleByIdQuery,
  useGetCategoriesQuery,
  useGetCategoryByArticleIdQuery,
  useGetTagsByArticleIdQuery,
  useGetTagsQuery,
  useUpdateArticleCategoryMutation,
  useUpdateArticleMutation,
} from "../../services/api";
import { toast } from "sonner";

const Creation: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [articleId, setArticleId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { user, isLoading: isAuthLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [categoryId, setCategoryId] = useState<number>(0);
  const [tagIds, setTagIds] = useState<number[]>([]);

  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { data: tags, isLoading: isTagsLoading } = useGetTagsQuery();

  const { data: existingArticle, isLoading: isArticleLoading } = useGetArticleByIdQuery(
    String(id),
    { skip: !id }
  );
  const { data: existingCategoryId } = useGetCategoryByArticleIdQuery(String(articleId), {
    skip: !articleId,
  });
  const { data: existingTagIds } = useGetTagsByArticleIdQuery(String(id), {
    skip: !id,
  });

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [updateArticleCategory] = useUpdateArticleCategoryMutation();

  const markdownInputRef = useRef<HTMLInputElement>(null);

  const turndownService = useMemo(
    () =>
      new TurndownService({
        codeBlockStyle: "fenced",
      }),
    []
  );

  useEffect(() => {
    turndownService.addRule("fencedCodeBlock", {
      filter: function (node) {
        return (
          node.nodeName === "PRE" &&
          node.firstChild !== null &&
          (node.firstChild as HTMLElement).nodeName === "CODE"
        );
      },
      replacement: function (_, node) {
        const codeNode = node.firstChild as HTMLElement;
        const lang = codeNode.getAttribute("class")?.match(/language-(\w+)/)?.[1] || "";
        const code = codeNode.textContent || "";
        return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
      },
    });
  }, [turndownService]);

  useEffect(() => {
    if (!isAuthLoading && user === null) {
      toast.error("请登入！");
      navigate("/");
    }
  }, [isAuthLoading, navigate, user]);

  useEffect(() => {
    if (!existingArticle) return;
    setArticleId(existingArticle.id);
    setTitle(existingArticle.title);
    setSummary(existingArticle.summary);
    setCoverImage(existingArticle.coverImage);
    setContent(existingArticle.content.replace(/\n/g, "<br>"));
  }, [existingArticle]);

  useEffect(() => {
    if (existingCategoryId) {
      setCategoryId(existingCategoryId);
    }
  }, [existingCategoryId]);

  useEffect(() => {
    if (existingTagIds) {
      setTagIds(existingTagIds);
    }
  }, [existingTagIds]);

  const markdown = useMemo(() => {
    return turndownService.turndown(content).replace(/\\/g, "");
  }, [content, turndownService]);

  const buildPayload = (): Partial<Article> => ({
    title,
    summary,
    coverImage,
    content: markdown,
    authorId: user?.id,
  });

  const fetchLatestDraftId = async (): Promise<number> => {
    if (!user?.id) return 0;
    try {
      const res = await fetchArticleDTOsByUserIdAPI(String(user.id), "1", "1", "draft");
      return res.data.data.articleDTOs[0]?.id ?? 0;
    } catch (e) {
      console.error(e);
      return 0;
    }
  };

  const submitArticle = async (status: ArticleStatus) => {
    if (status !== "deleted") {
      if (title === "") {
        toast.error("标题不能为空");
        return;
      }
      if (summary === "") {
        toast.error("简介不能为空");
        return;
      }
      if (categoryId === 0) {
        toast.error("类型不能为空");
        return;
      }
    }

    if (!user?.id) {
      toast.error("请登入！");
      return;
    }

    const basePayload = buildPayload();

    try {
      let savedId = articleId;

      if (articleId === 0) {
        const result = await createArticle({
          ...basePayload,
          authorId: user.id,
          status,
        } as ArticleCreatePayload).unwrap();
        savedId = typeof result === "number" ? result : await fetchLatestDraftId();
      } else {
        await updateArticle({
          ...basePayload,
          id: articleId,
          authorId: user.id,
          status,
        } as ArticleUpdatePayload).unwrap();
      }

      if (savedId && categoryId) {
        await updateArticleCategory({
          articleId: savedId,
          categoryId,
        }).unwrap();
      }

      const successText =
        status === "published" ? "发布成功" : status === "deleted" ? "删除成功" : "保存成功";
      toast.success(successText);

      if (status === "published" || status === "deleted") {
        navigate("/user");
      }
    } catch (e) {
      toast.error("操作失败");
      console.error(e);
    }
  };

  const onSave = () => submitArticle("draft");
  const onPublish = () => submitArticle("published");

  const onDelete = async () => {
    if (articleId === 0) return;
    const confirmed = window.confirm("确认删除？");
    if (!confirmed) return;
    await submitArticle("deleted");
  };

  const parseMarkdownFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      setContent(fileContent.replace(/\n/g, "<br>"));
      toast.success(`${file.name} 文件已加载`);
    };

    reader.onerror = () => {
      toast.error("文件读取失败");
    };

    reader.readAsText(file);
  };

  const handleMarkdownFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseMarkdownFile(file);
  };

  const handleContentChange = (value: string) => {
    setContent(value);
  };

  if (isAuthLoading || (id && isArticleLoading)) {
    return <Loading />;
  }

  return (
    <div className="flex justify-center">
      <div className="w-[1300px] max-w-full px-4 pt-[60px]">
        <div className="mt-5 flex items-center justify-evenly">
          <div className="flex flex-col">
            <div className="mb-5 flex items-center">
              <span className="p-[5px]">标题:</span>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-[70%]" />
            </div>
            <div className="mb-5">
              <span className="p-[5px]">类型:</span>
              <Select
                value={categoryId === 0 ? "" : String(categoryId)}
                onValueChange={(value) => setCategoryId(Number(value))}
                disabled={isCategoriesLoading}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <span className="p-[5px]">标签:</span>
              <div className="w-[70%]">
                <MultiSelect
                  placeholder="请选择"
                  value={tagIds}
                  onChange={(value) => setTagIds(value)}
                  loading={isTagsLoading}
                  options={tags?.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex flex-col gap-2">
              <Textarea
                onChange={(e) => setSummary(e.target.value)}
                placeholder="简介"
                value={summary}
                maxLength={100}
                className="h-[140px] w-[500px] resize-none"
              />
              <span className="text-right text-xs text-muted-foreground">{summary.length}/100</span>
            </div>
          </div>

          <div>
            <UploadButton url={coverImage} />
          </div>
        </div>

        <div className="mt-20">
          <div className="h-[65px]">
            <input
              ref={markdownInputRef}
              type="file"
              accept=".md"
              className="hidden"
              onChange={handleMarkdownFileChange}
            />
            <Button variant="outline" onClick={() => markdownInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              上传 Markdown
            </Button>
          </div>

          <Flexbox horizontal style={{ gap: 12 }}>
            <div
              style={{
                width: "50%",
                padding: 12,
                borderRight: "1px solid #eaeaea",
                overflow: "auto",
              }}
            >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdown || ""}</ReactMarkdown>
            </div>
            <div style={{ padding: 12, width: "50%" }}>
              <ReactQuill theme="snow" value={content} onChange={handleContentChange} />
            </div>
          </Flexbox>
        </div>

        <FloatingActionGroup
          actions={[
            { icon: Rocket, label: "发布", onClick: onPublish },
            { icon: Save, label: "保存", onClick: onSave, variant: "secondary" },
            { icon: Trash2, label: "删除", onClick: onDelete, variant: "destructive" },
          ]}
          showBackTop
        />
      </div>
    </div>
  );
};

export default Creation;
