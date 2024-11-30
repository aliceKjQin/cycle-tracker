import Dashboard from "@/app/dashboard/Dashboard";
import Main from "@/components/shared/Main";

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
