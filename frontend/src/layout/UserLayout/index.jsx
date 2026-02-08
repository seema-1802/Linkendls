import Navbar from "@/Components/Navbar";
import React from "react";

function Index({ children }) {
  return (
    <div>
        <div style={{ width: "100%", minHeight: "100vh" }}>

       
       <Navbar />
       <main style={{ width: "100%" }}>{children}</main>
     </div>
    </div>
  );
}

export default Index;
// https://github.com/seema-1802/Linkendls.git