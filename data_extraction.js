function extractData(json) {
  const result = json.result;

  const extractedData = {
    nr: result.nr,
    folders: result.folders || "",
    tags: result.tags || "",
    created: result.created,
    history: [],
    children: [],
  };

  // Extract history data
  function extractHistory(historyArray) {
    const historyData = [];
    if (historyArray && Array.isArray(historyArray)) {
      historyArray.forEach((entry) => {
        historyData.push({
          subject: entry.subject || "",
          created: entry.created || "",
          content: entry.content || "",
        });
      });
    }
    return historyData;
  }

  extractedData.history = extractHistory(result.history);

  // Recursive function to extract children data
  function extractChildren(childrenArray) {
    const childrenData = [];

    if (childrenArray && Array.isArray(childrenArray)) {
      childrenArray.forEach((child) => {
        const childData = {
          subject: child.subject || "",
          created: child.created || "",
          history: extractHistory(child.history),
          children: extractChildren(child.children),
        };

        childrenData.push(childData);
      });
    }

    return childrenData;
  }

  // Extract children data
  extractedData.children = extractChildren(result.children);

  return extractedData;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/todos", async (req, res) => {
  try {
    for (let cid = 0; cid <= 1400; cid++) {
      let data = JSON.stringify({
        method: "content.get",
        params: {
          cid: cid.toString(), // Update the cid here
          nid: "lgc3d6jpofc6h7",
          student_view: "null",
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://piazza.com/logic/api?method=content.get",
        headers: {
          "Csrf-Token": "9f429a0d1f1b95dbbb55868dfc75e7933fe8588b838306bb",
          Origin: "https://piazza.com",
          "Content-Type": "application/json",
          Cookie:
            "AWSALB=RrOjdA51B5kRJFDC1Fb6IIHJbhLLMMKymivbn3icYDJ3QBYXUtGGvtrKRuAnRRvhD5xVJ1qISsP9NTbyDUERF8Q9oCQsnTTnSyli/mIvbvScw7gVQcxRxPOFHXmo; AWSALBCORS=RrOjdA51B5kRJFDC1Fb6IIHJbhLLMMKymivbn3icYDJ3QBYXUtGGvtrKRuAnRRvhD5xVJ1qISsP9NTbyDUERF8Q9oCQsnTTnSyli/mIvbvScw7gVQcxRxPOFHXmo; last_piaz_user=lgjti39c8ix7cd; piazza_session=2.eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzM4NCJ9.eyJuYmYiOjE3MjQ1NTQxOTQsImRhdGEiOnsiZXhwaXJlcyI6MTcyNTc2Mzc5NCwicGVybSI6IjAiLCJsb2dnaW5nX2luIjp0cnVlLCJjcmVhdGVkX2F0IjoxNzI0NTU0MTk0LCJ3aGVuIjoxNzI0NTU0MTk0LCJob21lIjoiLyIsInJlbWVtYmVyIjoib24iLCJzZXNzaW9uX3Rva2VuIjoic3RfUllxejRPSGF2UUxHK2ZMVmU4ZXMiLCJuaWRzIjoibGdjM2Q2anBvZmM2aDc6MDsiLCJ0YWciOiIiLCJ1c2VyIjoibGdqdGkzOWM4aXg3Y2QiLCJlbWFpbCI6ImdlNTNkdXNAbXl0dW0uZGUifSwiaXNzIjoicGlhenphLmNvbSIsImV4cCI6MTcyNTc2Mzc5NH0.xA8U5z-7FqslEmlayBZTvVQ0eTTPOKc0Fz8_0jUqShbrxlSzUrXiaLVIb0UcdecvoZz9KymLjrTgXPJdRh6uEuDzY5vx7cYTzf3Q6ogPa9tG8iF5-E4chOciwNi_ErwM; session_id=9f429a0d1f1b95dbbb55868dfc75e7933fe8588b838306bb",
        },
        data: data,
      };

      const response = await axios.request(config);
      console.log(JSON.stringify(response.data));
      if (response.data.result !== null) {
        const extractedData = extractData(response.data);

        const newRecord = new ExtractedData(extractedData);
        await newRecord.save();
      }

      // Wait for 2 seconds before making the next request
      await sleep(2000);
    }

    res.json({ message: "Data extraction complete." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create record" });
  }
});
