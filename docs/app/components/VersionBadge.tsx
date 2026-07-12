async function getLatestVersion() {
  try {
    const res = await fetch('https://registry.npmjs.org/ryuki/latest', {
      next: { revalidate: 3600 }, // cache por 1 hora
    });
    const data = await res.json();
    return data.version || '0.3.4';
  } catch {
    return '0.3.4'; // fallback
  }
}

export async function VersionBadge() {
  const version = await getLatestVersion();

  return (
    <div>
      <div className="text-4xl font-bold text-purple-400">{version}</div>
      <div className="text-slate-400 mt-2">Latest Version</div>
    </div>
  );
}
