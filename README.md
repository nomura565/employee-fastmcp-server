# Employee Search FastMCP Server

TypeScriptとFastMCPを使った社員検索MCPサーバーです。同フォルダにある`社員一覧.csv`から社員情報を検索・取得できます。

## 特徴

- **FastMCP使用**: 従来のMCP SDKより簡潔で読みやすいコード
- **Zodバリデーション**: 型安全なパラメータ検証
- **4つの機能**: 名前検索、ID検索、全件取得、デバッグ

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

### 4. CSVファイル配置

CSVファイル`社員一覧.csv`は以下のいずれかの場所に配置してください：

1. **プロジェクトルート**（推奨）
```
employee-fastmcp-server/
├── 社員一覧.csv    ← ここ
├── build/
└── src/
```

2. **buildフォルダ内**
```
employee-fastmcp-server/
├── build/
│   ├── index.js
│   └── 社員一覧.csv    ← ここ
└── src/
```

サーバーは自動的に複数の場所を検索して、CSVファイルを見つけます。

**環境変数で指定**:
```bash
export CSV_FILE_PATH="/absolute/path/to/社員一覧.csv"
npm start
```

### トラブルシューティング

CSVファイルが見つからない場合、サーバーは以下の順序で検索を行います：

1. 環境変数 `CSV_FILE_PATH` で指定されたパス
2. プロジェクトルート: `./社員一覧.csv`
3. buildフォルダの親: `../社員一覧.csv`
4. buildフォルダ内: `./社員一覧.csv`

ログでどのパスが試行されたかを確認できます。

### 5. CSVファイル形式
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

### 4. `debug_csv_path`
- **説明**: CSVファイルの検索パスを確認（デバッグ用）
- **パラメータ**: なし

## デバッグ方法

CSVファイルが見つからない場合：

1. **`debug_csv_path`ツールを実行**してファイルの検索状況を確認
2. ログを確認してどのパスが試行されたかをチェック
3. 環境変数やファイル配置を調整

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
    "employee-search-server": {
      "command": "node",
      "args": ["/path/to/your/build/index.js"]
    }
  }
}
```