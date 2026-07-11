# GetMyPackage 年包包

一个用于把 Offer 的现金、股权、福利、时间成本、生活成本和风险折现成可比较“真实年包”的 Web App 项目。

## 当前阶段

- 先做本地功能 1.0：离线可用、用户自定义、默认指标、可保存多个 Offer 对比。
- 程序端和数据端分开：计算逻辑、前端展示、数据配置独立维护。
- 之后再考虑网页端、用户共建数据、爬取公开数据和第三方理财/税务能力。

## 本地运行

```bash
cd app
npm install
npm run build
npm run serve:dist -- 4173
```

打开 http://127.0.0.1:4173 查看 1.0 页面。

## GitHub Pages

计划发布地址：

https://jerryliruijie.github.io/GetMyPackage/

Pages 构建命令：

```bash
cd app
npm run build:pages
```

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会自动构建并部署 `app/dist`。

## 版本管理

当前版本：1.0.0

发布前必须运行：

```bash
cd app
npm run check:version
```

版本号需要同时保持 `VERSION`、`CHANGELOG.md`、`app/package.json` 和 `app/src/version.ts` 一致。

## 核心问题

互联网大厂员工选 Offer 时，不能只看 base、奖金和股票。通勤、三餐、班车、住房、医保、假期、工作强度、期权兑现概率、绩效波动、裁员风险、隐私风险等都会影响实际收入和生活质量。

GetMyPackage 的目标是：把“公司给你的”和“你为工作付出的”都量化成货币价值，并给出可调节、可解释的真实年包。
