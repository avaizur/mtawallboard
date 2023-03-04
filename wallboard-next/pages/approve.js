import Image from "next/image";

export default function ApproveBoard() {
  return (
    <div className="flex flex-col items-center h-screen pt-7">
      <div className="flex">
        <div className="rounded-md bg-mta-smart-blue h-16 w-16">
          <Image src="/images/logo_white.png" width="100" height="100" />
        </div>
        <div className="flex flex-col justify-start items-start pl-3">
          <div className="text-sm text-gray-500">MTA International</div>
          <div className="text-3xl text-gray-700">
            Wallboard for the Big Screen
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center h-full">
        <input
          className="text-gray-300 rounded-full px-3 py-1 border border-gray-300 shadow-sm w-96"
          placeholder="Wallboard Authorisation ID"
        />
        <button className="mt-9 px-3 py-1 bg-mta-primary-a text-white text-base rounded-full">
          Next
        </button>
      </div>
    </div>
  );
}
