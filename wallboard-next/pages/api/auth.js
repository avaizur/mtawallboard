import DYNAMO from "../../backend/dynamo";
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const {
    query: { id, guid },
    method,
    headers,
  } = req;

  let token = headers["x-auth-token"];
  try {
    jwt.verify(token, process.env.JWT_SECRET);

    switch (method) {
      case "GET":
        if (!id || !guid) {
          res.statusCode = 400;
          res.json({ error: "invalid wallboard id or guid" });
        } else {
          try {
            let token = await DYNAMO.getWallboardAuthToken({ id, guid });
            res.status(200).json({ token });
          } catch (exception) {
            res.status(403).json({ error: exception });
          }
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (exception) {
    console.error(
      `ERROR message="invalid auth token at /api/auth" exception=${exception}`
    );
    res.status(403).end("Token invalid");
  }
};
