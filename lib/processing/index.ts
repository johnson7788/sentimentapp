export function preprocessText(text: string): string {
    return text
      .replace(/[^\w\s]/g, '') // 移除特殊字符
      .toLowerCase()
      .trim();
  }