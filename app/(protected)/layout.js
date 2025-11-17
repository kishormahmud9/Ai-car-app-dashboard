import "../globals.css";
import Topbar from "../component/Topbar";
import Sidebar from "../component/Sidebar";

export default function RootLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 ">
        <div>
          <Topbar />
        </div>

        <main className="flex-1 min-h-0 overflow-y-auto bg-[#CCDCE9] pt-6 pb-[50px] pl-6 pr-12 hide-scrollbar ">
          <div className="w-full max-w-full overflow-x-hidden ">{children}</div>
        </main>
      </div>
    </div>
  );
}
