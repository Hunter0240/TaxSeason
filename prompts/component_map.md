# TaxSeason Component Map

This document outlines the component architecture for the TaxSeason application, serving as a reference for development. Items marked with ✅ have been implemented, while those without a marker are still to be developed.

## Frontend Component Structure

### Core Components
- **App**: ✅ Root component that manages routing and global state
- **Layout**: ✅ Main layout wrapper with navigation and sidebar
- **Dashboard**: ✅ Home page with summary of wallet activity and tax information
- **WalletConnect**: Component to manage blockchain wallet connections
- **TransactionList**: ✅ Displays paginated list of transactions from connected wallets (basic structure)
- **TransactionDetail**: Shows detailed information for individual transactions
- **TaxCalculator**: Component for processing transaction data and calculating tax implications
- **ExportManager**: ✅ Controls for generating and downloading CSV reports (basic structure)

### UI Components
- **Header**: ✅ Application header with navigation and user info
- **Sidebar**: ✅ Navigation sidebar with links to main sections
- **Footer**: Application footer with links and information
- **Modal**: ✅ Reusable modal component for dialogs (used in WalletsPage)
- **Button**: ✅ Styled button component with variants (using Material UI)
- **Card**: ✅ Container component for grouping related content (using Material UI Paper)
- **Table**: Reusable table component for displaying data
- **Dropdown**: Reusable dropdown menu component for selections
- **Tabs**: Tab navigation component
- **Notification**: Component for displaying alerts and notifications

### Pages
- **HomePage**: ✅ Landing page with dashboard
- **WalletsPage**: ✅ Manage connected wallets
- **TransactionsPage**: ✅ View and filter all transactions (basic structure)
- **TaxReportPage**: ✅ Generate tax reports and view tax calculations (basic structure)
- **SettingsPage**: ✅ Configure application settings

## Backend Component Structure

### API Routes
- **/api/wallets**: ✅ Endpoints for wallet management
- **/api/transactions**: Endpoints for fetching and processing transactions
- **/api/prices**: Historical price data endpoints
- **/api/tax-calculations**: Endpoints for tax-related calculations
- **/api/export**: Endpoints for generating export files

### Services
- **WalletService**: Wallet management functionality (partially implemented through controller)
- **GraphQLService**: ✅ Manages connections to The Graph protocol
- **TransactionService**: Processes and categorizes transactions
- **PriceService**: Fetches and caches historical price data
- **TaxCalculationService**: Handles tax calculations based on transaction data
- **ExportService**: Generates formatted CSV files

### Models
- **Wallet**: ✅ Represents a connected blockchain wallet
- **Transaction**: Represents a blockchain transaction
- **TaxEvent**: Represents a taxable event derived from transactions
- **PriceData**: Historical price information for assets
- **TaxReport**: Compiled tax information ready for export
- **UserSettings**: User configuration settings

### Controllers
- **walletController**: ✅ Handles wallet-related API requests
- **transactionController**: Handles transaction-related API requests
- **taxCalculationController**: Handles tax calculation requests
- **exportController**: Handles export generation requests

### Utilities
- **BlockchainConnector**: Utilities for connecting to blockchain networks
- **DataFormatter**: Utilities for formatting data
- **CsvGenerator**: Utilities for generating CSV files
- **TaxAlgorithms**: Implementation of various tax calculation algorithms
- **DateUtils**: Date formatting and calculation utilities
- **ValidationUtils**: Data validation utilities

This component map will continue to evolve as development progresses, with components being added, modified, or removed as needed. 