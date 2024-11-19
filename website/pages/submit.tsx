import { useState, ChangeEvent, FormEvent } from "react";
import Editor from "react-simple-code-editor";
// @ts-expect-error TS can't see node_modules/@types/prismjs for some reason
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button } from "@aws-amplify/ui-react";

export default function Home() {
  const { user } = useAuthenticator();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("Select a file for upload");
  const [code, setCode] = useState<string>(
    "function add(a, b) {\n return a + b;\n}"
  );

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const sendFile = async (file: Blob) => {
    const formData = new FormData();
    formData.append("code", file);
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        body: formData,
        headers: { authorization: user.userId },
      });

      if (response.ok) {
        return "File uploaded successfully!";
      } else {
        return "File upload failed.";
      }
    } catch {
      return "An error occurred while uploading the file.";
    }
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }
    setMessage(await sendFile(file));
  };

  const handleCodeUpload = async () => {
    const file = {
      name: "code.js",
      type: "application/javascript",
      content: Buffer.from(code).toString("utf-8"),
    };
    setMessage(await sendFile(new Blob([file.content], { type: file.type })));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>File Upload</h1>
      <form
        onSubmit={handleUpload}
        style={{
          paddingBottom: 20,
        }}
      >
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>
      <p>{message}</p>
      <Editor
        value={code}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 20,
          backgroundColor: "white",
        }}
      />

      <Button onClick={handleCodeUpload}>Upload Code</Button>
    </div>
  );
}
