export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProperties {
  items: BreadcrumbItem[];
  className?: string;
  /**
   * Accessible label for the breadcrumb navigation.
   * @default "Breadcrumb"
   */
  ariaLabel?: string;
}
