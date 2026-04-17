import { getCollectionAuthData } from '@/app/[locale]/[username]/[collectionSlug]/actions';
import { AuthDataSetter } from './AuthDataSetter';

type Properties = {
  username: string;
  collectionSlug: string;
  collectionId: string;
  collectionUserId: string;
};

export async function CollectionAuthLoader({
  username,
  collectionSlug,
  collectionId,
  collectionUserId,
}: Properties) {
  const authData = await getCollectionAuthData(username, collectionSlug, collectionId, collectionUserId);
  return <AuthDataSetter authData={authData} />;
}
