export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.4';
  };
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      catalog_item_stores: {
        Row: {
          catalog_item_id: string;
          product_url: string | null;
          store_id: string;
        };
        Insert: {
          catalog_item_id: string;
          product_url?: string | null;
          store_id: string;
        };
        Update: {
          catalog_item_id?: string;
          product_url?: string | null;
          store_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'catalog_item_stores_catalog_item_id_fkey';
            columns: ['catalog_item_id'];
            isOneToOne: false;
            referencedRelation: 'catalog_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'catalog_item_stores_store_id_fkey';
            columns: ['store_id'];
            isOneToOne: false;
            referencedRelation: 'stores';
            referencedColumns: ['id'];
          },
        ];
      };
      catalog_items: {
        Row: {
          created_at: string;
          description: string | null;
          franchise_id: string | null;
          id: string;
          image_url: string | null;
          images: Json;
          line_id: string | null;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          franchise_id?: string | null;
          id?: string;
          image_url?: string | null;
          images?: Json;
          line_id?: string | null;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          franchise_id?: string | null;
          id?: string;
          image_url?: string | null;
          images?: Json;
          line_id?: string | null;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'catalog_items_franchise_id_fkey';
            columns: ['franchise_id'];
            isOneToOne: false;
            referencedRelation: 'franchises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'catalog_items_line_id_fkey';
            columns: ['line_id'];
            isOneToOne: false;
            referencedRelation: 'lines';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      collection_items: {
        Row: {
          catalog_item_id: string | null;
          collection_id: string;
          created_at: string;
          date_acquired: string | null;
          description: string | null;
          franchise_id: string | null;
          id: string;
          image_url: string | null;
          likes_count: number;
          line_id: string | null;
          name: string;
          slug: string;
          updated_at: string;
          user_id: string;
          variant: string | null;
          visibility: string;
        };
        Insert: {
          catalog_item_id?: string | null;
          collection_id: string;
          created_at?: string;
          date_acquired?: string | null;
          description?: string | null;
          franchise_id?: string | null;
          id?: string;
          image_url?: string | null;
          likes_count?: number;
          line_id?: string | null;
          name: string;
          slug?: string;
          updated_at?: string;
          user_id: string;
          variant?: string | null;
          visibility?: string;
        };
        Update: {
          catalog_item_id?: string | null;
          collection_id?: string;
          created_at?: string;
          date_acquired?: string | null;
          description?: string | null;
          franchise_id?: string | null;
          id?: string;
          image_url?: string | null;
          likes_count?: number;
          line_id?: string | null;
          name?: string;
          slug?: string;
          updated_at?: string;
          user_id?: string;
          variant?: string | null;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'collection_items_catalog_item_id_fkey';
            columns: ['catalog_item_id'];
            isOneToOne: false;
            referencedRelation: 'catalog_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collection_items_collection_id_fkey';
            columns: ['collection_id'];
            isOneToOne: false;
            referencedRelation: 'collections';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collection_items_franchise_id_fkey';
            columns: ['franchise_id'];
            isOneToOne: false;
            referencedRelation: 'franchises';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collection_items_line_id_fkey';
            columns: ['line_id'];
            isOneToOne: false;
            referencedRelation: 'lines';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'collection_items_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      collections: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string;
          public_items: number | null;
          slug: string;
          total_items: number | null;
          updated_at: string;
          user_id: string;
          visibility: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name: string;
          public_items?: number | null;
          slug: string;
          total_items?: number | null;
          updated_at?: string;
          user_id: string;
          visibility?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string;
          public_items?: number | null;
          slug?: string;
          total_items?: number | null;
          updated_at?: string;
          user_id?: string;
          visibility?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'collections_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      franchise_localized_names: {
        Row: {
          created_at: string;
          franchise_id: string;
          id: string;
          locale: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          franchise_id: string;
          id?: string;
          locale: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          franchise_id?: string;
          id?: string;
          locale?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'franchise_localized_names_franchise_id_fkey';
            columns: ['franchise_id'];
            isOneToOne: false;
            referencedRelation: 'franchises';
            referencedColumns: ['id'];
          },
        ];
      };
      franchises: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          image_url: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      item_likes: {
        Row: {
          created_at: string;
          item_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          item_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          item_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'item_likes_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'collection_items';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'item_likes_item_id_fkey';
            columns: ['item_id'];
            isOneToOne: false;
            referencedRelation: 'last_arrivals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'item_likes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      lines: {
        Row: {
          brand_id: string;
          category_id: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          slug: string;
          variants: Json;
        };
        Insert: {
          brand_id: string;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          slug: string;
          variants?: Json;
        };
        Update: {
          brand_id?: string;
          category_id?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          slug?: string;
          variants?: Json;
        };
        Relationships: [
          {
            foreignKeyName: 'lines_brand_id_fkey';
            columns: ['brand_id'];
            isOneToOne: false;
            referencedRelation: 'brands';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'lines_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          id: string;
          role: string;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          id: string;
          role?: string;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          id?: string;
          role?: string;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      stores: {
        Row: {
          address: string | null;
          city: string | null;
          country: string | null;
          cover_url: string | null;
          created_at: string;
          google_place_id: string | null;
          id: string;
          lat: number | null;
          lng: number | null;
          logo_url: string | null;
          name: string;
          slug: string;
          url: string | null;
          verified: boolean;
          visible: boolean;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          cover_url?: string | null;
          created_at?: string;
          google_place_id?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          name: string;
          slug: string;
          url?: string | null;
          verified?: boolean;
          visible?: boolean;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          country?: string | null;
          cover_url?: string | null;
          created_at?: string;
          google_place_id?: string | null;
          id?: string;
          lat?: number | null;
          lng?: number | null;
          logo_url?: string | null;
          name?: string;
          slug?: string;
          url?: string | null;
          verified?: boolean;
          visible?: boolean;
        };
        Relationships: [];
      };
    };
    Views: {
      last_arrivals: {
        Row: {
          avatar_url: string | null;
          brand_name: string | null;
          brand_slug: string | null;
          collection_id: string | null;
          collection_slug: string | null;
          created_at: string | null;
          id: string | null;
          image_url: string | null;
          line_name: string | null;
          line_slug: string | null;
          name: string | null;
          slug: string | null;
          username: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'collection_items_collection_id_fkey';
            columns: ['collection_id'];
            isOneToOne: false;
            referencedRelation: 'collections';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      get_slug_options: {
        Args: {
          p_brand_name?: string;
          p_collection_id: string;
          p_exclude_slug?: string;
          p_line_name?: string;
          p_name: string;
          p_variant?: string;
        };
        Returns: {
          label: string;
          priority: number;
          slug: string;
        }[];
      };
      is_admin: { Args: never; Returns: boolean };
      search_catalog_items: {
        Args: { max_results?: number; query: string };
        Returns: {
          franchise_id: string;
          franchise_name: string;
          id: string;
          image_url: string;
          line_id: string;
          line_name: string;
          name: string;
          score: number;
          slug: string;
        }[];
      };
      show_limit: { Args: never; Returns: number };
      show_trgm: { Args: { '': string }; Returns: string[] };
      unaccent: { Args: { '': string }; Returns: string };
    };
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables']
    & DefaultSchema['Views'])
    ? (DefaultSchema['Tables']
      & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I;
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U;
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
