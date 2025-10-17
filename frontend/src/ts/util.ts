export function sortByKey<T extends any[]>(array: T, key: string, reverse = false) {
  return array.sort(function (a, b) {
    const x = a[key];
    const y = b[key];

    const comparison = x < y ? -1 : x > y ? 1 : 0;
    return reverse ? -comparison : comparison;
  }) as T;
}

export function GetParentDirectory(path: string) {
  if (!path) return "/";

  const pathParts = path.split("/");
  if (pathParts.length === 1) return pathParts[0];
  pathParts.pop();

  return pathParts.join("/");
}

export function GetFolderName(path: string) {
  const pathParts = path.split("/");

  return pathParts[pathParts.length - 1];
}
