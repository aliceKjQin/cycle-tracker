import Dashboard from "@/components/dashboard/Dashboard";
import Main from "@/components/sharedUI/Main";

export const metadata = {
  title: "Cycle Tracker ⋅ Dashboard ",
  description: "Track your cycle",
};

export default function DashboardPage() {
  return (
    <Main>
      <Dashboard />
    </Main>
  );
}
