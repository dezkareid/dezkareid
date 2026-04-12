export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProperties {
  items: BreadcrumbItem[];
  className?: string;
}
