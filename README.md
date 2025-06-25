# Employee Search FastMCP Server

TypeScriptとFastMCPを使った社員検索MCPサーバーです。同フォルダにある`社員一覧.csv`から社員情報を検索・取得できます。

## 特徴

- **FastMCP使用**: 従来のMCP SDKより簡潔で読みやすいコード
- **Zodバリデーション**: 型安全なパラメータ検証
- **3つの検索機能**: 名前検索、ID検索、全件取得

## セットアップ

### 1. プロジェクト初期化
```bash
mkdir employee-fastmcp-server
cd employee-fastmcp-server
npm init -y
```

### 2. 依存関係のインストール
```bash
npm install fastmcp zod
npm install -D @types/node typescript
```

### 3. ファイル配置
```
employee-fastmcp-server/
├── src/
│   └── index.ts          # メインサーバーコード
├── build/                # ビルド出力フォルダ
│   └── index.js          # コンパイル後のJSファイル
├── 社員一覧.csv           # 社員データ (プロジェクトルート)
├── package.json
├── tsconfig.json
└── README.md
```

### 4. CSVファイル形式
```csv
社員番号,氏名,メールアドレス
E001,田中太郎,tanaka.taro@company.com
E002,佐藤花子,sato.hanako@company.com
```

## 実行方法

### 開発時（TypeScriptファイル直接実行）
```bash
npm run dev
```

### ビルド後実行
```bash
npm run build
npm start
```

### MCP Inspector（デバッグ用）
```bash
npm run inspect
```

## 利用可能なツール

### 1. `search_employee_by_name`
- **説明**: 社員名で部分一致検索
- **パラメータ**: 
  - `name` (string): 検索する社員名

### 2. `get_employee_by_id`
- **説明**: 社員番号で完全一致検索  
- **パラメータ**:
  - `employeeId` (string): 社員番号

### 3. `get_all_employees`
- **説明**: 全社員一覧を取得
- **パラメータ**: なし

## FastMCPの利点

従来のMCP SDKと比較して：

- **コード量が約50%削減**: ボイラープレートコードが不要
- **型安全性**: Zodスキーマによる自動バリデーション
- **可読性向上**: 直感的なAPI設計
- **開発体験向上**: 組み込みの開発・デバッグツール

## Claude Desktopでの設定例

`~/.claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "employee-search": {
      "command": "node",
      "args": ["/path/to/your/build/index.js"]
    }
  }
}
```