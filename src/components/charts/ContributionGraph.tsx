import React from "react";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ContributionGraphProps {
  username: string;
}

export function ContributionGraph({ username }: ContributionGraphProps) {
  const { darkMode } = useSelector((state: RootState) => state.theme);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white dark:bg-[#0d1117] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
        GitHub Contributions
      </h3>
      <div className="flex justify-center overflow-x-auto pb-4 text-black dark:text-white">
        <div className="min-w-max">
          <GitHubCalendar
            username={username}
            colorScheme={darkMode ? "dark" : "light"}
            blockSize={14}
            blockMargin={5}
            fontSize={14}
            theme={{
              light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
