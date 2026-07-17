export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
}

export const primaryNavigation: NavigationItem[] = [
  { label: "Publications", href: "/publications" },
  { label: "Projects", href: "/projects" },
  { label: "Resources", href: "/resources" },
  { label: "Teaching", href: "/teaching" },
];

export const secondaryNavigation: NavigationItem[] = [
  { label: "Datasets", href: "/datasets", description: "Documented research collections" },
  { label: "Software", href: "/software", description: "Open-source research tools" },
  { label: "Patents", href: "/patents", description: "Inventions and technology transfer" },
  { label: "Talks & media", href: "/media", description: "Lectures and public scholarship" },
  { label: "Academic profile", href: "/cv", description: "Appointment and researcher identifiers" },
];

export const footerNavigation = [
  {
    title: "Research",
    links: [primaryNavigation[0], primaryNavigation[1], secondaryNavigation[2]],
  },
  {
    title: "Open work",
    links: [secondaryNavigation[0], secondaryNavigation[1], secondaryNavigation[3]],
  },
  {
    title: "Profile",
    links: [primaryNavigation[3], secondaryNavigation[4], { label: "Contact", href: "/contact" }],
  },
];
