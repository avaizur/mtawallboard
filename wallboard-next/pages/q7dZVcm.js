// VOD Media Release Dashboard

import { useEffect, useState } from "react";

export default function VODMediaReleaseBoard({}) {
  const [marker, setMarker] = useState(false);
  const [pending, setPending] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [published, setPublished] = useState([]);

  useEffect(() => {
    getIssues();
  }, [marker]);

  async function pollIssues() {
    setTimeout(() => {
      getIssues();
    }, 900000); // every 15 minutes
  }

  async function getIssues() {
    let response = await fetch("/api/issue");
    let issues = await response.json();

    let pe = [];
    let ip = [];
    let pu = [];

    if (issues && issues.length > 0) {
      issues.forEach((issue) => {
        let status = issue.fields.status.name;
        switch (status) {
          case "Pending Approval":
            pe.push(issue);
            break;
          case "Export Scheduled":
          case "Processing":
          case "Ingesting":
            ip.push(issue);
            break;
          case "Published":
            pu.push(issue);
            break;
          default:
            break;
        }
      });

      setPending(pe);
      setInProgress(ip);
      setPublished(pu);
    }

    pollIssues();
  }

  function renderIssue(issue, index) {
    return (
      <tr key={index}>
        <td className="px-1 py-2 whitespace-nowrap">
          <div className="flex items-center">
            <div className="ml-4">
              <div className="text-xs font-medium text-gray-900">
                {issue.fields.customfield_10038}
              </div>
              <div className="text-xs text-gray-500">
                P{issue.fields.customfield_10034}
              </div>
            </div>
          </div>
        </td>
        <td className="px-2 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {issue.fields.description}
          </div>
          <div className="text-sm text-gray-500"></div>
        </td>
        {/* <td className="px-2 py-4 whitespace-nowrap">
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {issue.fields.status.name}
          </span>
        </td> */}
      </tr>
    );
  }

  return (
    <div className="flex w-full justify-between pt-3">
      <div className="flex flex-col flex-grow mx-2 bg-white rounded-md shadow-md">
        <div className="text-2xl text-gray-700 px-3 py-2">Pending</div>
        <div className="mt-1 h-1 w-full bg-red-500"></div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto min-w-full sm:-mx-6 lg:-mx-8">
            <div className="w-full py-2 align-middle inline-block sm:px-6 lg:px-8">
              <div className="w-full shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        VX / PID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pending.map(renderIssue)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow mx-2 bg-white rounded-md shadow-md">
        <div className="text-2xl text-gray-700 px-3 py-2">In Progress</div>
        <div className="mt-1 h-1 w-full bg-blue-500"></div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto min-w-full sm:-mx-6 lg:-mx-8">
            <div className="w-full py-2 align-middle inline-block sm:px-6 lg:px-8">
              <div className="w-full shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        VX / PID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inProgress.map(renderIssue)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow mx-2 bg-white rounded-md shadow-md">
        <div className="text-2xl text-gray-700 px-3 py-2">Published</div>
        <div className="mt-1 h-1 w-full bg-green-500"></div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto min-w-full sm:-mx-6 lg:-mx-8">
            <div className="w-full py-2 align-middle inline-block sm:px-6 lg:px-8">
              <div className="w-full shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        VX / PID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      {/* <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {published.map(renderIssue)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
