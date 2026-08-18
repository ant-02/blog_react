import "@testing-library/jest-dom/vitest";

// 测试环境下拦截真实的 XMLHttpRequest 请求，避免未捕获的网络报错污染输出。
class FakeXMLHttpRequest {
  status = 200;
  statusText = "OK";
  readyState = 4;
  response = "{}";
  responseText = "{}";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null = null;

  open() {}
  setRequestHeader() {}
  send() {
    queueMicrotask(() => {
      this.readyState = 4;
      this.status = 200;
      this.onreadystatechange?.call(
        this as unknown as XMLHttpRequest,
        new Event("readystatechange")
      );
      this.onload?.call(this as unknown as XMLHttpRequest, new ProgressEvent("load"));
    });
  }
  abort() {}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
globalThis.XMLHttpRequest = FakeXMLHttpRequest as any;
