export const generateSlugId = (
  text: string,
  options: {
    prefix?: string;
    maintainCase?: boolean;
    separator?: string;
    allowUnicode?: boolean;
  } = {},
  existingIds: Set<string> = new Set()
): string => {
  // 默认配置
  const {
    prefix = "",
    maintainCase = false,
    separator = "-",
    allowUnicode = true,
  } = options;

  // 1. 大小写处理
  let id = maintainCase ? text : text.toLowerCase();

  // 2. 字符替换
  id = id
    // 允许 Unicode 字符（如中文）
    .replace(allowUnicode ? /[^\p{L}\p{N}\s-]/gu : /[^\w\s-]/g, "")
    // 将空白字符替换为分隔符
    .replace(/\s+/g, separator)
    // 替换连续的分隔符为单个
    .replace(new RegExp(`${separator}+`, "g"), separator)
    // 移除首尾分隔符
    .replace(new RegExp(`^${separator}|${separator}$`, "g"), "");

  // 3. 处理空结果
  if (!id) id = "section";

  // 4. 添加前缀
  id = prefix + id;

  // 5. 确保唯一性
  const originalId = id;
  let counter = 1;
  while (existingIds.has(id)) {
    id = `${originalId}-${counter++}`;
  }
  existingIds.add(id);

  return id;
};
