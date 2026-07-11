# 版本管理规则

年包包从 1.0.0 开始使用 SemVer：

- `MAJOR`：数据结构、计算口径或用户可见流程发生不兼容变化。
- `MINOR`：新增功能或新增可选字段，但兼容旧数据。
- `PATCH`：文案、样式、缺陷修复和不影响数据结构的小改动。

## 单次发布必须同步

以下位置必须保持一致：

- 根目录 `VERSION`
- `app/package.json` 的 `version`
- `app/src/version.ts` 的 `APP_VERSION`
- `CHANGELOG.md` 的最新版本条目

发布或构建前运行：

```bash
cd app
npm run check:version
```

## 本地数据版本

前端保存到浏览器的数据必须带上 `DATA_SCHEMA_VERSION`。如果后续 schema 不兼容，升级时先写迁移逻辑，不要直接复用旧 key。
