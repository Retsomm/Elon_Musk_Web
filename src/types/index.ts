// 統一類型定義導出文件
// 從這個文件可以導入所有類型定義

// 新聞相關類型
export type {
  NewsArticle,
  NewsMetadata,
  NewsResponse,
  NewsCache,
  FirebaseFunctionError,
  FirebaseFunctionErrorCode,
  GetNewsParams,
  FirebaseNewsResponse,
  UseFetchNewsReturn,
  SwrNewsOptions,
  ArticleDedupeKey,
  DateString,
  ISOString,
  NewsSortOrder,
  NewsFilterOptions,
  NewsStats
} from './news';

// 時間軸相關類型
export type {
  TimelineMedia,
  TimelineItem,
  TimelineEvent,
  TimelineProps,
  Product,
  Company,
  CompanyParams
} from './timeline';

// 收藏功能相關類型
export type {
  FavoriteItem,
  CreateFavoriteParams,
  UpdateFavoriteParams,
  FavoriteQueryOptions,
  UseFavoriteItemReturn,
  UseAllFavoritesReturn,
  FavoriteStats,
  FavoriteButtonProps,
  FavoriteListProps,
  FavoriteCardProps
} from './favorites';

// 通用類型
export type {
  BaseEntity,
  User,
  NavItem,
  ModalProps,
  MediaContent,
  PaginationProps,
  ApiResponse,
  LoadingState,
  ValidationError,
  FormState,
  SearchOptions,
  SearchResult,
  ToastMessage,
  ThemeConfig,
  LocalStorageKeys,
  RouteConfig,
  ErrorInfo,
  ErrorBoundaryState,
  PerformanceMetric,
  FirebaseUser
} from './common';

// 數據模型相關類型
export type {
  LifeEvent,
  Book,
  Podcast,
  YouTubeContent,
  DataCollection,
  DataFilter,
  DataStats,
  DataImportOptions,
  DataExportOptions,
  SyncStatus,
  BackupInfo
} from './data';

// Firebase 相關類型
export type {
  FirebaseError,
  FirebaseConfig,
  DatabaseSnapshot,
  DatabaseReference,
  AuthProvider,
  AuthMethod,
  SignInCredentials,
  SignUpData,
  PasswordResetData,
  UserUpdateData,
  FirebaseOperationResult,
  BatchOperation,
  QueryOptions,
  ListenerOptions,
  OfflineConfig,
  SecurityRules
} from './firebase';

// 認證相關類型
export type {
  LoginType,
  AppUser,
  AuthState as AuthStoreState,
  AuthActions,
  AuthStore,
  AuthStoreCreator,
  RegisterParams,
  LoginParams,
  UpdateUserNameParams,
  AuthStateChangeCallback
} from './auth';

// 自定義 Hook 相關類型
export type {
  BaseHookReturn,
  AuthState,
  UseFirebaseUserIdReturn,
  UseFirebaseUserIdExtendedReturn,
  UseAuthReturn,
  UseDatabaseValueReturn,
  UseDatabaseListReturn,
  HookOptions,
  AuthHookOptions,
  DatabaseHookOptions,
  UseLocalStorageReturn,
  UseAsyncReturn,
  UseFormReturn,
  UseInfiniteScrollReturn,
  UseSearchReturn
} from './hooks';

// Toast 通知相關類型
export type {
  ToastOptions,
  PromiseMessages,
  PromiseToastOptions,
  ToastStore,
  ToastInstance,
  ToastType,
  ToastPosition,
  ToastAnimation,
  ExtendedToastOptions,
  ToastEventHandlers,
  ToastConfig
} from './toast';

// Member 頁面相關類型
export type {
  MemberTabType,
  MemberState,
  MemberEventHandlers,
  MemberProps,
  TabButtonConfig,
  MemberProfileInfo,
  NameEditValidation,
  MemberPageConfig
} from './member';

// 注意：firebase.d.ts 是聲明文件，提供基本的模塊聲明
// 詳細的 Firebase 類型請使用上面從 './firebase' 導入的類型