const { parse } = require("json2csv");
const fs = require("fs");
const path = require("path");

// コマンドライン引数からJSONファイルが保存されているディレクトリとCSV出力ディレクトリを取得
// 引数が指定されていない場合はカレントディレクトリ('./')と'./csv/'をデフォルト値とする
const jsonDir = process.argv[2] || "./";
const csvDir = process.argv[3] || "./csv/";

// CSVディレクトリが存在しない場合は作成
if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

fs.readdir(jsonDir, (err, files) => {
  if (err) {
    return console.log(
      "ディレクトリの読み込み中にエラーが発生しました: " + err
    );
  }

  files
    .filter((file) => path.extname(file).toLowerCase() === ".json")
    .forEach((file) => {
      fs.readFile(path.join(jsonDir, file), "utf8", (err, data) => {
        if (err) {
          return console.log(
            file + " の読み込み中にエラーが発生しました: " + err
          );
        }

        try {
          const jsonData = JSON.parse(data);
          const csv = parse(jsonData);
          const outputPath = path.join(
            csvDir,
            path.basename(file, ".json") + ".csv"
          );

          fs.writeFile(outputPath, csv, (err) => {
            if (err) throw err;
            console.log(`${outputPath} にCSVファイルが正常に保存されました。`);
          });
        } catch (err) {
          console.error(file + " の変換中にエラーが発生しました: ", err);
        }
      });
    });
});
