import { defaultMeta, seo } from "@/lib/seo";

describe('Seo', () => {
  it('should return a title even when empty', () => {
    const result = seo({});
    expect(result.title).toBe(defaultMeta.title);
  });
  it('should return a description even when empty', () => {
    const result = seo({});
    expect(result.description).toBe(defaultMeta.description);
  });
});