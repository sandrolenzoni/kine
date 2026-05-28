export const formatDuration = (ms: number | null | undefined): string | null => {
  if (ms === null || ms === undefined) return null;
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(0)} ms`;
};

export const formatSize = (kb: number | null | undefined): string | null => {
  if (kb === null || kb === undefined) return null;
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
};
