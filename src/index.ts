import { FastMCP } from "fastmcp";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// ES moduleで__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 社員データの型定義
interface Employee {
  employeeId: string;
  name: string;
  email: string;
}

// CSVファイルパス（buildパスの親ディレクトリ）
const CSV_FILE_CANDIDATES = path.join(__dirname, "..", "社員一覧.csv");

/**
 * 存在するCSVファイルパスを取得
 */
async function findCSVFile(): Promise<string> {
  try {
    await fs.access(CSV_FILE_CANDIDATES);
    //console.log(`CSVファイルを発見: ${candidate}`);
    return CSV_FILE_CANDIDATES;
  } catch {
    throw new Error(`CSVファイルが見つかりません。以下の場所を確認してください:\n${CSV_FILE_CANDIDATES}`);
  }
}

/**
 * CSVファイルを読み込んで社員データに変換
 */
async function loadEmployeeData(): Promise<Employee[]> {
  try {
    const csvFilePath = await findCSVFile();
    const csvContent = await fs.readFile(csvFilePath, "utf-8");
    const lines = csvContent.trim().split("\n");
    
    // ヘッダー行をスキップ
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const [employeeId, name, email] = line.split(",").map(field => field.trim());
      return { employeeId, name, email };
    });
  } catch (error) {
    console.error("CSVファイルの読み込みエラー:", error);
    return [];
  }
}

// FastMCPサーバーを作成
const server = new FastMCP({
  name: "employee-search-server",
  version: "1.0.0",
});

// 社員名で検索するツール
server.addTool({
  name: "search_employee_by_name",
  description: "社員名で社員を検索します（部分一致）",
  parameters: z.object({
    name: z.string().describe("検索する社員名"),
  }),
  execute: async (args) => {
    const employees = await loadEmployeeData();
    const results = employees.filter(emp => 
      emp.name.toLowerCase().includes(args.name.toLowerCase())
    );
    
    if (results.length === 0) {
      return `「${args.name}」に一致する社員が見つかりませんでした。`;
    }
    
    return `検索結果: ${results.length}件\n\n` + 
      results.map(emp => 
        `社員番号: ${emp.employeeId}\n氏名: ${emp.name}\nメール: ${emp.email}`
      ).join("\n\n");
  },
});

// 社員番号で検索するツール
server.addTool({
  name: "get_employee_by_id",
  description: "社員番号で社員情報を取得します",
  parameters: z.object({
    employeeId: z.string().describe("社員番号"),
  }),
  execute: async (args) => {
    const employees = await loadEmployeeData();
    const employee = employees.find(emp => emp.employeeId === args.employeeId);
    
    if (!employee) {
      return `社員番号「${args.employeeId}」の社員が見つかりませんでした。`;
    }
    
    return `社員番号: ${employee.employeeId}\n氏名: ${employee.name}\nメール: ${employee.email}`;
  },
});

// 全社員一覧を取得するツール
server.addTool({
  name: "get_all_employees",
  description: "全社員の一覧を取得します",
  parameters: z.object({}),
  execute: async () => {
    const employees = await loadEmployeeData();
    
    if (employees.length === 0) {
      return "社員データが見つかりませんでした。";
    }
    
    return `全社員一覧 (${employees.length}名)\n\n` + 
      employees.map(emp => 
        `${emp.employeeId} | ${emp.name} | ${emp.email}`
      ).join("\n");
  },
});

// サーバーを起動
server.start({
  transportType: "stdio",
});