import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4 space-y-12">
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Speak up. <span className="">Campus listens.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          CampusEcho is the official platform for students and staff to report
          issues, track resolutions, and improve our university environment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/submit">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
              Submit a Complaint <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/track">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 text-base"
            >
              Track Status <Search className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full pt-12 border-t text-left">
        <div className="space-y-3">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
            <MegaphoneIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Easy Reporting</h3>
          <p className="text-muted-foreground">
            Submit complaints anonymously or track them using your ID. Simple,
            fast, and effective.
          </p>
        </div>
        <div className="space-y-3">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Real-time Tracking</h3>
          <p className="text-muted-foreground">
            Know exactly what is happening with your complaint through live
            status updates.
          </p>
        </div>
        <div className="space-y-3">
          <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Guaranteed Action</h3>
          <p className="text-muted-foreground">
            Directly connected to university administration to ensure issues are
            resolved promptly.
          </p>
        </div>
      </div>
    </div>
  );
}

function MegaphoneIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}
