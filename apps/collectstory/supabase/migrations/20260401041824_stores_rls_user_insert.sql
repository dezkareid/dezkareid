-- Update stores public read to filter on visible = true
DROP POLICY IF EXISTS stores_public_read ON stores;
CREATE POLICY stores_public_read ON stores
  FOR SELECT USING (visible = true);

-- Any authenticated user can create a store (unverified by default)
DROP POLICY IF EXISTS stores_user_insert ON stores;
CREATE POLICY stores_user_insert ON stores
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Remove admin-only insert policy (replaced by user insert above)
DROP POLICY IF EXISTS stores_admin_insert ON stores;

-- Keep admin update policy (admin can set verified, visible, edit details)
-- stores_admin_update already exists, no change needed

-- Remove admin hard-delete policy (replaced by soft-delete via visible flag)
DROP POLICY IF EXISTS stores_admin_delete ON stores;

-- collection_item_stores: item owner can manage store associations
CREATE POLICY cis_owner_insert ON collection_item_stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM collection_items
      WHERE id = item_id AND user_id = auth.uid()
    )
  );

CREATE POLICY cis_owner_delete ON collection_item_stores
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM collection_items
      WHERE id = item_id AND user_id = auth.uid()
    )
  );

-- Public can read store associations (needed for item detail pages)
CREATE POLICY cis_public_select ON collection_item_stores
  FOR SELECT USING (true);
