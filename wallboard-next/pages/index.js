import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="rounded-md bg-mta-smart-blue h-16 w-16">
        <Image src="/images/logo_white.png" width="100" height="100" />
      </div>
    </div>
  );
}
