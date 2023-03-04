const fetch = require("node-fetch");

const JIRA_API_BASE_URL = "https://muslimtv.atlassian.net/rest/api/latest/";

const JIRA_AUTH =
  "Basic " +
  new Buffer.from(
    process.env.JIRA_AUTH_USERNAME + ":" + process.env.JIRA_AUTH_TOKEN
  ).toString("base64");

module.exports = {
  /**
   * Creates an issue for PID if it doesn't already exists.
   * Returns issue key.
   *
   * @param {number} pid
   */
  createIssue: async (pid, upid, vx, title, language, issueType) => {
    let url = JIRA_API_BASE_URL + "issue";

    let payload = {
      fields: {
        project: {
          key: process.env.JIRA_PROJECT_NAME,
        },
        summary: `[PID-${pid}] ${
          issueType == "Subtitle"
            ? "VOD Subtitle"
            : issueType == "Translation"
            ? "VOD Translation"
            : "VOD Asset"
        } Publish Request`,
        description: title,
        issuetype: {
          name: `${issueType}`,
        },
      },
    };

    /* add custom fields */
    payload.fields[process.env.JIRA_CF_PID] = parseInt(pid);
    payload.fields[process.env.JIRA_CF_UPID] = parseInt(upid);
    payload.fields[process.env.JIRA_CF_VX] = vx ?? "";
    // payload.fields[process.env.JIRA_CF_EMBED_CODE] = "";

    /* add language custom field for Subtitle & Translation issue types only */
    if (
      issueType == process.env.JIRA_SUBTITLE_ISSUE_TYPE ||
      issueType == process.env.JIRA_TRANSLATION_ISSUE_TYPE
    ) {
      payload.fields[process.env.JIRA_CF_LANGUAGE] = language ?? "";
    }

    try {
      let existingIssue = await module.exports.searchIssueByPID(
        pid,
        upid,
        issueType,
        language
      );

      if (
        existingIssue &&
        existingIssue.issues &&
        existingIssue.issues.length > 0
      ) {
        return existingIssue.issues[0].key;
      }

      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: JIRA_AUTH,
        },
      });

      if (!response.ok) throw await response.text();

      let issueData = await response.json();

      return issueData.key;
    } catch (exception) {
      console.error(`ERROR ${new Date().toUTCString()} ${exception}`);
      throw exception;
    }
  },

  /**
   * Get all VOD media release tickets
   *
   */
  getAllVODMediaReleaseTickets: async () => {
    let jql = `project = ${process.env.JIRA_PROJECT_NAME} AND issuetype = "Asset" AND (status = "Pending Approval" OR status = "Export Scheduled" OR status = Ingesting OR status = Processing OR status = Published)  AND updatedDate >= -7d ORDER BY created DESC`;

    let url = JIRA_API_BASE_URL + `search?jql=${jql}`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: JIRA_AUTH,
        },
      });

      if (!response.ok) throw await response.text();

      return await response.json();
    } catch (exception) {
      console.error(`ERROR ${new Date().toUTCString()} ${exception}`);
      throw exception;
    }
  },

  /**
   * Search for an issue by PID & UPID. Returns issue detail such as ID,
   * key and link to self.
   *
   * @param {number} pid
   * @param {number} upid
   */
  searchIssueByPID: async (pid, upid, issueType, languageCode) => {
    let jql = `project = ${process.env.JIRA_PROJECT_NAME} AND issuetype = "${issueType}" AND ("Programme ID" = ${pid} OR "Unique Programme ID" = ${upid})`;

    if (issueType == "Subtitle" || issueType == "Translation") {
      if (languageCode) {
        jql += ` AND "Language" ~ "${languageCode.toUpperCase()}"`;
      }
    }

    let url = JIRA_API_BASE_URL + `search?jql=${jql}`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: JIRA_AUTH,
        },
      });

      if (!response.ok) throw await response.text();

      return await response.json();
    } catch (exception) {
      console.error(`ERROR ${new Date().toUTCString()} ${exception}`);
      throw exception;
    }
  },

  /**
   * Get issue detail by key.
   *
   * @param {string} issueKey
   */
  getIssueByKey: async (issueKey) => {
    let url = JIRA_API_BASE_URL + `issue/${issueKey}?expand=transitions`;

    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: JIRA_AUTH,
        },
      });

      if (!response.ok) throw await response.text();

      return await response.json();
    } catch (exception) {
      console.error(`ERROR ${new Date().toUTCString()} ${exception}`);
      throw exception;
    }
  },

  /**
   * Transitions issue to the given transition name. No-op if
   * the issue is already in that state or if transitioning
   * to given state is not possible based on workflow.
   *
   * @param {number} pid
   * @param {string} transitionName
   */
  transitionIssueForPID: async (
    pid,
    upid,
    transitionName,
    issueType,
    language
  ) => {
    try {
      let issueSearchResponse = await module.exports.searchIssueByPID(
        pid,
        upid,
        issueType,
        language
      );

      if (
        issueSearchResponse &&
        issueSearchResponse.issues &&
        issueSearchResponse.issues.length > 0
      ) {
        let issueKey = issueSearchResponse.issues[0].key;

        let issueDetail = await module.exports.getIssueByKey(issueKey);

        if (
          issueDetail &&
          issueDetail.transitions &&
          issueDetail.transitions.length > 0
        ) {
          let i = 0;
          for (i in issueDetail.transitions) {
            let transition = issueDetail.transitions[i];

            if (transition && transition.name === transitionName) {
              let url = JIRA_API_BASE_URL + `issue/${issueKey}/transitions`;

              let payload = { transition: { id: transition.id } };

              let response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(payload),
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: JIRA_AUTH,
                },
              });

              if (!response.ok) throw await response.text();
            }
          }
        }
      }
    } catch (exception) {
      console.error(`ERROR ${new Date().toUTCString()} ${exception}`);
      throw exception;
    }
  },
};
