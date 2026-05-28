const queryString = (args: Record<string, any>) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(args)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.append(key, item.toString());
        }
      } else {
        params.append(key, value.toString());
      }
    }
  }
  const str = params.toString();
  return str ? `?${str}` : "";
};

export { queryString };
