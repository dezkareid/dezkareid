CREATE TABLE collection_item_stores (
  item_id  UUID NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, store_id)
);

ALTER TABLE collection_item_stores ENABLE ROW LEVEL SECURITY;
