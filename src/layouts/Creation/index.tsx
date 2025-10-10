import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchArticleAPI,
  insertArticle,
  updateArticleByIdAPI,
} from "../../apis/article";
import UploadButton from "../../components/UploadButton";
import classNames from "classnames";
import "./index.scss";
import {
  Button,
  Flex,
  FloatButton,
  Input,
  Select,
  Space,
  Upload,
  UploadProps,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteOutlined,
  RocketOutlined,
  SaveOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../stores";
import Swal from "sweetalert2";
import { DraggablePanel, Markdown } from "@ant-design/pro-editor";
import { Flexbox } from "react-layout-kit";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import TurndownService from "turndown";
import { Category } from "../../models/category";
import {
  fetchCategoriesAPI,
  fetchCategoryByArticleIdAPI,
} from "../../apis/category";
import { Tag } from "../../models/tag";
import { fetchTagsAPI, fetchTagsByArticleIdAPI } from "../../apis/tag";
import { Article } from "../../models/article";
import { updateArticleCategoryAPI } from "../../apis/articleCategory";
import { ArticleCategory } from "../../models/articleCategory";

const Creation: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [articleId, setArticleId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { user, isLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);
  const [tagIds, setTagIds] = useState<number[]>([]);
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced", // 使用 ``` 而不是缩进
  });

  // ✅ 添加规则：把 <pre><code>...</code></pre> 转成 ``` 代码块
  turndownService.addRule("fencedCodeBlock", {
    filter: function (node) {
      return (
        node.nodeName === "PRE" &&
        node.firstChild !== null &&
        (node.firstChild as HTMLElement).nodeName === "CODE"
      );
    },
    replacement: function (content, node) {
      const codeNode = node.firstChild as HTMLElement;
      const lang =
        codeNode.getAttribute("class")?.match(/language-(\w+)/)?.[1] || "";
      const code = codeNode.textContent || "";
      return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });

  useEffect(() => {
    if (!isLoading && user === null) {
      Swal.fire("请登入！");
      navigate("/");
    }
  }, [isLoading]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetchCategoriesAPI();
        setCategories(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    const getTags = async () => {
      try {
        const res = await fetchTagsAPI();
        setTags(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getCategories();
    getTags();
  }, []);

  useEffect(() => {
    if (id === null || id === undefined) return;
    const getArticle = async () => {
      try {
        const res = await fetchArticleAPI(String(id));
        setArticleId(res.data.data.id);
        setTitle(res.data.data.title);
        setSummary(res.data.data.summary);
        setCoverImage(res.data.data.coverImage);
        setContent(res.data.data.content.replace(/\n/g, "<br>"));
      } catch (e) {
        console.log(e);
      }
    };
    getArticle();
  }, [id]);

  useEffect(() => {
    if (id === null || id === undefined) return;
    console.log(id);
    const getTagIds = async () => {
      try {
        const res = await fetchTagsByArticleIdAPI(String(id));
        setTagIds(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getTagIds();
  }, [id, tags]);

  useEffect(() => {
    if (id === null || id === undefined) return;
    const getCategoryId = async () => {
      try {
        const res = await fetchCategoryByArticleIdAPI(String(articleId));
        setCategoryId(res.data.data);
      } catch (e) {
        console.log(e);
      }
    };
    getCategoryId();
  }, [id, articleId]);

  const handleCategoryChange = (value: number) => {
    setCategoryId(value);
  };

  const handleTagChange = (value: number[]) => {
    setTagIds(value);
  };

  const onSummaryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSummary(e.target.value);
  };

  const onTitleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTitle(e.target.value);
  };

  const props: UploadProps = {
    name: "file",
    accept: ".md",
    multiple: false,
    maxCount: 1,
    customRequest: ({ onSuccess }) => {
      setTimeout(() => {
        onSuccess?.("ok");
      }, 0);
    },
    onChange: (info) => {
      const { file } = info;
      if (file.status === "removed") {
        setContent("");
        return;
      }
      if (file.status === "done") {
        message.success(`${file.name} 文件已加载`);
      } else if (file.status === "error") {
        message.error(`${file.name} 文件加载失败`);
      }

      if (file.originFileObj) {
        parseMarkdownFile(file.originFileObj);
      }
    },
  };

  const parseMarkdownFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content.replace(/\n/g, "<br>"));
    };

    reader.onerror = () => {
      message.error("文件读取失败");
    };

    reader.readAsText(file);
  };

  const onSave = () => {
    const saveArticle = async () => {
      if (title == "") {
        Swal.fire("标题不能为空");
        return;
      }
      if (summary == "") {
        Swal.fire("简介不能为空");
        return;
      }
      if (categoryId == 0) {
        Swal.fire("类型不能为空");
        return;
      }
      if (articleId == 0) {
        const res = await insertArticle({
          title: title,
          summary: summary,
          coverImage: coverImage,
          content: turndownService.turndown(content).replace(/\\/g, ""),
          authorId: user?.id,
          status: "draft",
        } as Article);
        if (res.data.data) {
          const res = await updateArticleCategoryAPI({
            articleId: articleId,
            categoryId: categoryId,
          } as ArticleCategory);
          if (res.data.data) {
            Swal.fire({ text: "保存成功", icon: "success" });
            return;
          }
        }
        Swal.fire({ text: "保存失败", icon: "error" });
      } else {
        const res = await updateArticleByIdAPI({
          id: articleId,
          title: title,
          summary: summary,
          coverImage: coverImage,
          content: turndownService.turndown(content).replace(/\\/g, ""),
          authorId: user?.id,
          status: "draft",
        } as Article);
        if (res.data.data) {
          const res = await updateArticleCategoryAPI({
            articleId: articleId,
            categoryId: categoryId,
          } as ArticleCategory);
          if (res.data.data) {
            Swal.fire({ text: "保存成功", icon: "success" });
            return;
          }
        }
        Swal.fire({ text: "保存失败", icon: "error" });
      }
    };
    saveArticle();
  };

  const onPublish = () => {
    const publishArticle = async () => {
      if (title == "") {
        Swal.fire("标题不能为空");
        return;
      }
      if (summary == "") {
        Swal.fire("简介不能为空");
        return;
      }
      if (categoryId == 0) {
        Swal.fire("类型不能为空");
        return;
      }
      if (articleId == 0) {
        const res = await insertArticle({
          title: title,
          summary: summary,
          coverImage: coverImage,
          content: turndownService.turndown(content).replace(/\\/g, ""),
          authorId: user?.id,
          status: "published",
        } as Article);
        if (res.data.data) {
          const res = await updateArticleCategoryAPI({
            articleId: articleId,
            categoryId: categoryId,
          } as ArticleCategory);
          if (res.data.data) {
            Swal.fire({ text: "发布成功", icon: "success" });
            navigate("/user");
            return;
          }
        }
        Swal.fire({ text: "发布失败", icon: "error" });
        navigate("/user");
      } else {
        const res = await updateArticleByIdAPI({
          id: articleId,
          title: title,
          summary: summary,
          coverImage: coverImage,
          content: turndownService.turndown(content).replace(/\\/g, ""),
          authorId: user?.id,
          status: "published",
        } as Article);
        if (res.data.data) {
          const res = await updateArticleCategoryAPI({
            articleId: articleId,
            categoryId: categoryId,
          } as ArticleCategory);
          if (res.data.data) {
            Swal.fire({ text: "发布成功", icon: "success" });
            navigate("/user");
            return;
          }
        }
        Swal.fire({ text: "发布失败", icon: "error" });
        navigate("/user");
      }
    };
    publishArticle();
  };

  const onDelete = () => {
    const deleteArticle = async () => {
      if (title == "") {
        Swal.fire("标题不能为空");
        return;
      }
      if (summary == "") {
        Swal.fire("简介不能为空");
        return;
      }
      if (categoryId == 0) {
        Swal.fire("类型不能为空");
        return;
      }
      if (categoryId)
        if (articleId == 0) {
          const res = await insertArticle({
            title: title,
            summary: summary,
            coverImage: coverImage,
            content: turndownService.turndown(content).replace(/\\/g, ""),
            authorId: user?.id,
            status: "deleted",
          } as Article);
          if (res.data.data) {
            Swal.fire({ text: "删除成功", icon: "success" });
          } else {
            Swal.fire({ text: "删除失败", icon: "error" });
          }
        } else {
          const res = await updateArticleByIdAPI({
            id: articleId,
            title: title,
            summary: summary,
            coverImage: coverImage,
            content: turndownService.turndown(content).replace(/\\/g, ""),
            authorId: user?.id,
            status: "deleted",
          } as Article);
          if (res.data.data) {
            Swal.fire({ text: "删除成功", icon: "success" });
          } else {
            Swal.fire({ text: "删除失败", icon: "error" });
          }
          navigate("/user");
        }
    };
    deleteArticle();
  };

  useEffect(() => {
    const md = turndownService.turndown(content).replace(/\\/g, "");
    setMarkdown(md);
  }, [content]);

  const handleContentChange = (value: string) => {
    setContent(value); // 原始 HTML
  };

  return (
    <div className={classNames("creation-out")}>
      <div className={classNames("creation-in")}>
        <div className={classNames("creation-header")}>
          <div className={classNames("creation-header-left")}>
            <div className={classNames("creation-title")}>
              <span>标题:</span>
              <Input value={title} onChange={onTitleChange} />
            </div>
            <div className={classNames("creation-category")}>
              <span>类型:</span>
              <Space wrap>
                <Select
                  value={categoryId == 0 ? undefined : categoryId}
                  style={{ width: 120 }}
                  onChange={handleCategoryChange}
                  options={categories && categories.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                />
              </Space>
            </div>
            <div className={classNames("creation-tag")}>
              <span>标签:</span>
              <Space style={{ width: "70%" }} direction="vertical">
                <Select
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  value={tagIds}
                  onChange={handleTagChange}
                  options={tags && tags.map((tag) => ({
                    label: tag.name,
                    value: tag.id,
                  }))}
                />
              </Space>
            </div>
          </div>

          <div className={classNames("creation-summary")}>
            <Flex vertical gap={32}>
              <TextArea
                showCount
                maxLength={100}
                onChange={onSummaryChange}
                placeholder="简介"
                value={summary}
                style={{ width: "500px", height: "140px", resize: "none" }}
              />
            </Flex>
          </div>

          <div>
            <UploadButton url={coverImage} />
          </div>
        </div>

        <div className={classNames("creation-content")}>
          <div style={{ height: "65px" }}>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          <Flexbox horizontal>
            <DraggablePanel
              placement="left"
              maxWidth={650}
              style={{ width: "100%", padding: 12 }}
            >
              <Markdown>{markdown}</Markdown>
            </DraggablePanel>
            <div style={{ padding: 12, width: "100%" }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={handleContentChange}
              />
            </div>
          </Flexbox>
        </div>

        <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
          <FloatButton
            icon={<RocketOutlined />}
            tooltip="发布"
            onClick={onPublish}
          />
          <FloatButton
            icon={<SaveOutlined />}
            tooltip="保存"
            onClick={onSave}
          />
          <FloatButton
            icon={<DeleteOutlined />}
            tooltip="删除"
            onClick={onDelete}
          />
          <FloatButton.BackTop visibilityHeight={0} tooltip="返回顶部" />
        </FloatButton.Group>
      </div>
    </div>
  );
};

export default Creation;
