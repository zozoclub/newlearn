import express, { Request, Response, Application } from "express";
import cors from "cors";
import axios, { AxiosError } from "axios";

const app: Application = express();
const PORT: number = 3000;
console.log(PORT);

app.use(cors());

const proxyHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const word: string = req.query.word as string;
    if (!word) {
      res.status(400).send("Word parameter is required");
      return;
    }
    const response = await axios.get(
      `https://dic.daum.net/search.do?q=${encodeURIComponent(word)}`
    );
    res.send(response.data);
  } catch (error: unknown) {
    console.error("Error occurred:", error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      res
        .status(axiosError.response?.status || 500)
        .send(`Error occurred while fetching data: ${axiosError.message}`);
    } else {
      res.status(500).send("An unexpected error occurred");
    }
  }
};

app.get("/proxy", proxyHandler);

// 서버 확인용
// app.listen(PORT, () => {
//   console.log(`Proxy server is running on http://localhost:${PORT}`);
// });

export default app;
