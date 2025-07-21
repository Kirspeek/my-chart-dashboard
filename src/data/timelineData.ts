export interface TimelineItem {
  year: string;
  color: "yellow" | "red" | "blue" | "teal" | "purple";
  title: string;
  desc: string;
  progress?: number;
}

export const timelineData: TimelineItem[] = [
  {
    year: "2014",
    color: "yellow",
    title: "Your Title",
    desc: "Enthusiastic after frictionless where client-based ideas sound niches.",
    progress: 0.9,
  },
  {
    year: "2017",
    color: "red",
    title: "Your Title",
    desc: "Enthusiastic after frictionless where client-based ideas sound niches.",
    progress: 0.7,
  },
  {
    year: "2018",
    color: "blue",
    title: "Your Title",
    desc: "Enthusiastic after frictionless where client-based ideas sound niches.",
    progress: 0.5,
  },
  {
    year: "2020",
    color: "teal",
    title: "Your Title",
    desc: "Enthusiastic after frictionless where client-based ideas sound niches.",
    progress: 0.8,
  },
  {
    year: "2021",
    color: "purple",
    title: "Your Title",
    desc: "Enthusiastic after frictionless where client-based ideas sound niches.",
    progress: 0.6,
  },
];
