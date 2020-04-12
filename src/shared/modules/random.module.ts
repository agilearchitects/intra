export class RandomModule {
  public static string(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return new Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
  }
}