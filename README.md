# Excel2TS

## Description

This is a simple tool to convert Excel files to TypeScript Types. 

> Only support csv files for now.

## Installation

```bash
npm install -g excel2ts
```

## Example

```bash
excel2ts convert -i "./test" -d "./test/dts" -t "./test/typ" --key "id"
```

## Usage

```bash
excel2ts convert -i <inputExcelFile> -d [declarationDir] -t [typescriptDir] -k [keyColumn]
```

- -i or --input: The input Excel file or folder path.
- (optional) -d or --declaration: The output folder for the declaration file.
- (optional) -t or --typescript: The output folder for the TypeScript file.
- (optional) -k or --key: The key column name in the Excel file.

A csv file should look like this:

```csv
key1,key2,key3
string,number,boolean
string1,1,true
string2,2,FALSE
```

> Note: The first row is the key of the type, the second row is the type of the key, and the rest of the rows are the values of the key.

so the dts file will look like this:

```typescript
export interface test1 {
    key2: number;
    key3: boolean;
}
```

*key1 is missing because it is the primary key*

and the typ file will look like this:

```typescript
export class test1 {
    static readonly data = [
            {
                "key1": "string1",
                "key2": 1,
                "key3": true
            },
            {
                "key1": "string2",
                "key2": 2,
                "key3": false
            }
        ];
}
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

