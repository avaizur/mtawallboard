import JIRA from "../../backend/jira";

export default async (req, res) => {
  const { method } = req;

  try {
    switch (method) {
      case "GET":
        try {
          let response = await JIRA.getAllVODMediaReleaseTickets();
          if (response && response.issues && response.issues.length > 0) {
            res.status(200).json(response.issues);
          } else {
            res.status(200).json([]);
          }
        } catch (exception) {
          res.status(500).json({ error: exception });
        }
        break;
      case "POST":
        if (isNaN(pid)) {
          res.status(400).json({ error: "invalid pid" });
          return;
        } else if (isNaN(upid)) {
          res.status(400).json({ error: "invalid upid" });
          return;
        }

        try {
          await JIRA.createIssue(pid, upid, vx, title, language, issueType);

          await JIRA.transitionIssueForPID(
            pid,
            upid,
            transition,
            issueType,
            language
          );

          res.status(200).json({});
        } catch (exception) {
          res.status(500).json({ error: exception });
        }
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (exception) {
    console.error(
      `ERROR message="invalid auth token at /api/jira/issue" exception=${exception}`
    );
    res.status(403).end("Token invalid");
  }
};
