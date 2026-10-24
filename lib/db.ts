export const db = {
  ready: true,
  name: 'fotolab',
};

export async function getDbClient() {
  return db;
}
