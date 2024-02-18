import axios from "axios";

const getTodaysQuote = async (req: any, res: any) => {
  try {
    const response = await axios.get(
      "https://frasedeldia.azurewebsites.net/api/phrase"
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getTodaysQuote,
};
