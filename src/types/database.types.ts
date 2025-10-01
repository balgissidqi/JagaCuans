// export type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [key: string]: Json | undefined }
//   | Json[]

// export type Database = {
//   public: {
//     Tables: {
//       users: {
//         Row: {
//           id: string
//           email: string
//           created_at: string
//         }
//         Insert: {
//           id?: string
//           email: string
//           created_at?: string
//         }
//         Update: {
//           id?: string
//           email?: string
//           created_at?: string
//         }
//         Relationships: []
//       }

//       spending_tracker: {
//         Row: {
//           id: string
//           user_id: string
//           budget_id: string | null
//           description: string
//           amount: number
//           date: string
//           income: boolean
//           created_at: string
//           updated_at: string | null
//           deleted_at: string | null
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           budget_id?: string | null
//           description: string
//           amount: number
//           date: string
//           income?: boolean
//           created_at?: string
//           updated_at?: string | null
//           deleted_at?: string | null
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           budget_id?: string | null
//           description?: string
//           amount?: number
//           date?: string
//           income?: boolean
//           created_at?: string
//           updated_at?: string | null
//           deleted_at?: string | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "spending_tracker_user_id_fkey"
//             columns: ["user_id"]
//             isOneToOne: false
//             referencedRelation: "users"
//             referencedColumns: ["id"]
//           }
//         ]
//       }

//       budgeting: {
//         Row: {
//           id: string
//           user_id: string
//           category: string
//           amount: number
//           spent: number
//           period: string
//           notes: string | null
//           created_at: string
//           updated_at: string | null
//           deleted_at: string | null
//         }
//         Insert: {
//           id?: string
//           user_id: string
//           category: string
//           amount: number
//           spent?: number
//           period: string
//           notes?: string | null
//           created_at?: string
//           updated_at?: string | null
//           deleted_at?: string | null
//         }
//         Update: {
//           id?: string
//           user_id?: string
//           category?: string
//           amount?: number
//           spent?: number
//           period?: string
//           notes?: string | null
//           created_at?: string
//           updated_at?: string | null
//           deleted_at?: string | null
//         }
//         Relationships: [
//           {
//             foreignKeyName: "budgeting_user_id_fkey"
//             columns: ["user_id"]
//             isOneToOne: false
//             referencedRelation: "users"
//             referencedColumns: ["id"]
//           }
//         ]
//       }

//   public: {
//     Tables: {
//       income: {
//         Row: {
//           id: string;
//           user_id: string;
//           amount: number;
//           category: string;
//           notes: string | null;
//           created_at: string;
//           updated_at: string | null;
//         };
//         Insert: {
//           id?: string;
//           user_id: string;
//           amount: number;
//           category?: string;
//           notes?: string | null;
//           created_at?: string;
//           updated_at?: string | null;
//         };
//         Update: {
//           id?: string;
//           user_id?: string;
//           amount?: number;
//           category?: string;
//           notes?: string | null;
//           created_at?: string;
//           updated_at?: string | null;
//         };
//         Relationships: [
//           {
//             foreignKeyName: "income_user_id_fkey";
//             columns: ["user_id"];
//             isOneToOne: false;
//             referencedRelation: "users";
//             referencedColumns: ["id"];
//           }
//         ];
//       };

//     }

//     Views: {
//       [_ in never]: never
//     }

//     Functions: {
//       [_ in never]: never
//     }

//     Enums: {
//       [_ in never]: never
//     }
//   }
// }
// }
// }

