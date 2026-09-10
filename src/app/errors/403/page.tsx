import Link from "next/link";
import ForbiddenActions from "./ForbiddenActions";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
            {/* ========================= */}
            {/* LEFT - ILLUSTRATION */}
            {/* ========================= */}
            <div className="relative flex items-center justify-center bg-blue-50 p-8 md:p-12 overflow-hidden">
              {/* Background decoration */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200/40 rounded-full" />
              <div className="absolute -bottom-24 -right-20 w-72 h-72 bg-blue-300/30 rounded-full" />

              <div className="relative z-10 w-full max-w-[500px]">
                <svg
                  className="w-full h-auto block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 500 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g id="freepik--background-simple--inject-3">
                    <path
                      d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
                      fill="#3B82F6"
                    />
                    <path
                      d="M55.48,273.73s2.32,72,62.43,120,143.41,51.43,210.84,56,119.23-33.62,127-91.32-43.72-74.64-71.68-140.33S358.64,130.8,299.49,90.4,147.8,74.81,99.29,144,55.48,273.73,55.48,273.73Z"
                      fill="#fff"
                      opacity="0.7"
                    />
                  </g>

                  {/* PADLOCK */}
                  <g id="freepik--Padlock--inject-3">
                    <path
                      d="M83.61,179.69V153.92c0-18.24,15.16-33.08,33.79-33.08s33.79,14.84,33.79,33.08v25.77h13.47V153.92c0-25.51-21.2-46.27-47.26-46.27s-47.26,20.76-47.26,46.27v25.77Z"
                      fill="none"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />
                    <rect
                      x="65.14"
                      y="179.87"
                      width="103.18"
                      height="85.35"
                      fill="none"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />
                    <path
                      d="M127.46,215.32a11.24,11.24,0,0,0-22.47,0,11,11,0,0,0,5.9,9.68L109,244.38h14.45L121.56,225A11,11,0,0,0,127.46,215.32Z"
                      fill="none"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />
                  </g>

                  {/* CHARACTER */}
                  <g id="freepik--Character--inject-3">
                    <polygon
                      points="232.64 267.99 206.95 266.3 206.95 265.88 203.79 266.09 200.64 265.88 200.64 266.3 174.95 267.99 156 423.79 174.95 423.79 203.16 299.57 204.43 299.57 232.64 423.79 251.59 423.79 232.64 267.99"
                      fill="#263238"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M156,423.78l-4.63,7.16-14.32,6.32a4.88,4.88,0,0,0-2.52,4.21v5.47h40.84a54.21,54.21,0,0,0,0-8.84c-.42-4.21-.42-14.32-.42-14.32Z"
                      fill="#4c4c4c"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M134.53,442.31v4.63h40.84s.19-2,.19-4.63Z"
                      fill="#263238"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M251.51,423.78l4.63,7.16,14.32,6.32a4.88,4.88,0,0,1,2.52,4.21v5.47H232.14a54.21,54.21,0,0,1,0-8.84c.42-4.21-.42-14.32-.42-14.32Z"
                      fill="#4c4c4c"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M273,442.31v4.63H232.14s-.18-2-.19-4.63Z"
                      fill="#263238"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M164.07,195.51s-30,42.16-30,45.25,4.77,26.95,12.35,29.19,11.79-1.68,13.19-9.54-3.37-19.09-3.37-19.09l14-12.63Z"
                      fill="#3B82F6"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="170.38 193.6 164.07 195.51 174.01 261.86 233.09 261.86 242.08 195.89 234.05 192.83 204.41 186.33 170.38 193.6"
                      fill="#3B82F6"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="236.34 215.78 235.01 225.34 224.68 227.82 214.16 223.62 214.93 215.01 236.34 215.78"
                      fill="#263238"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <circle
                      cx="225.35"
                      cy="223.52"
                      r="1.82"
                      fill="#4c4c4c"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="198.1 198.57 203.65 205.07 196.57 250.19 204.03 262.05 212.83 249.62 205.37 205.26 211.68 199.14 204.99 190.54 198.1 198.57"
                      fill="#263238"
                      stroke="#263238"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="192.75 187.29 167.32 193.6 168.09 196.66 192.94 189.77 192.75 187.29"
                      fill="#263238"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="213.59 186.52 239.02 192.83 238.26 195.89 213.4 189.01 213.59 186.52"
                      fill="#263238"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    {/* HEAD */}
                    <path
                      d="M219,161.07s7.06-1.72,8.39-8.78S216,136.64,207.18,135.12s-21.75,7.63-23.85,13.93,6.1,12.59,14.88,13.93S219,161.07,219,161.07Z"
                      fill="#263238"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <polygon
                      points="193.52 173.9 193.52 186.52 204.22 196.47 216.27 186.14 216.27 174.29 193.52 173.9"
                      fill="#ccc"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M191.92,158.4s-.58,11.83.38,15.65,7.25,11.83,12.21,13.55,11.83-8.59,13.36-12,.95-17.94.95-17.94-2.09-5-6.29-6.48S195.35,147,191.92,158.4Z"
                      fill="#ccc"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    {/* EYES */}
                    <path
                      d="M199.85,164.68c0,.9-.41,1.63-.92,1.63s-.92-.73-.92-1.63.41-1.63.92-1.63S199.85,163.78,199.85,164.68Z"
                      fill="#263238"
                    />

                    <path
                      d="M211.56,164.68c0,.9-.41,1.63-.92,1.63s-.92-.73-.92-1.63.41-1.63.92-1.63S211.56,163.78,211.56,164.68Z"
                      fill="#263238"
                    />

                    {/* HAIR */}
                    <path
                      d="M191.48,158.15s.43.35.42.52c1.85,1,6.1,2.84,13,3.21a26.56,26.56,0,0,0,14-3.43c0-.51,0-.81,0-.82-.17-4.47-3.49-7.45-7.6-8.59a19.57,19.57,0,0,0-12.24.61,12,12,0,0,0-5.07,3.65C193.48,153.86,190.78,157.59,191.48,158.15Z"
                      fill="#4c4c4c"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <path
                      d="M191.92,158.4a45.19,45.19,0,0,0,13,.95c8.21-.38,13.92-.95,13.92-.95a22.64,22.64,0,0,1-13.8,6.06A15.14,15.14,0,0,1,191.92,158.4Z"
                      fill="#4c4c4c"
                    />
                  </g>

                  {/* BARRIER */}
                  <g id="freepik--security-barrier--inject-3">
                    <polygon
                      points="86.87 446.5 72.61 446.5 91.62 313.99 105.88 313.99"
                      fill="#263238"
                    />

                    <polygon
                      points="115.39 446.5 129.64 446.5 110.63 313.99 96.38 313.99"
                      fill="#fff"
                    />

                    <polygon
                      points="289.18 446.5 274.93 446.5 293.93 313.99 308.19 313.99"
                      fill="#263238"
                    />

                    <polygon
                      points="317.7 446.5 331.95 446.5 312.94 313.99 298.69 313.99"
                      fill="#fff"
                    />

                    <rect
                      x="55.73"
                      y="293.21"
                      width="271.93"
                      height="26.36"
                      fill="#3B82F6"
                    />

                    <rect
                      x="62.36"
                      y="293.21"
                      width="271.93"
                      height="26.36"
                      fill="#3B82F6"
                    />

                    <polygon
                      points="66.81 319.57 89.89 319.57 101.82 293.21 78.74 293.21"
                      fill="#263238"
                    />

                    <polygon
                      points="158.17 293.21 135.09 293.21 123.16 319.57 146.24 319.57"
                      fill="#263238"
                    />

                    <polygon
                      points="327.21 293.21 304.13 293.21 292.21 319.57 315.29 319.57"
                      fill="#263238"
                    />

                    <polygon
                      points="270.87 293.21 247.78 293.21 235.86 319.57 258.94 319.57"
                      fill="#263238"
                    />

                    <polygon
                      points="214.52 293.21 191.44 293.21 179.51 319.57 202.59 319.57"
                      fill="#263238"
                    />

                    <line
                      x1="332.8"
                      y1="304.9"
                      x2="287.8"
                      y2="304.9"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />

                    <line
                      x1="61.21"
                      y1="308.21"
                      x2="106.21"
                      y2="308.21"
                      stroke="#263238"
                      strokeWidth="1.166"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* ========================= */}
            {/* RIGHT - MESSAGE */}
            {/* ========================= */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
              <div className="mb-6">
                <span className="inline-flex items-center rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
                  403 · FORBIDDEN
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
                You are not authorized
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-500">
                You tried to access a page that you do not have permission to
                access.
              </p>

              <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-500">
                  If you believe this is a mistake, please contact your
                  administrator or request the required permission.
                </p>
              </div>

              {/* BUTTONS */}
              <ForbiddenActions />

              <div className="mt-8 text-sm text-slate-400">
                Error code: <span className="font-semibold">403</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
