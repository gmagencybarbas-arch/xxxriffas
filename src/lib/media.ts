/** Arquivos em /public/midia-rifas — use encodeURIComponent no nome do arquivo. */
export function mediaFile(folder: string, fileName: string): string {
  return `/midia-rifas/${folder}/${encodeURIComponent(fileName)}`;
}
