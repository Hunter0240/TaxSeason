import { request, gql } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

const GRAPH_API_URL = process.env.GRAPH_API_URL || 'https://api.thegraph.com/subgraphs/name/arbitrum/arbitrum-one-transactions';

/**
 * Service to interact with The Graph Protocol for retrieving blockchain data
 */
class GraphQLService {
  /**
   * Fetch transactions for a specific wallet address
   * @param address Wallet address to fetch transactions for
   * @param limit Number of transactions to fetch
   * @param skip Number of transactions to skip (for pagination)
   */
  async getWalletTransactions(address: string, limit: number = 100, skip: number = 0) {
    const query = gql`
      query GetWalletTransactions($address: String!, $limit: Int!, $skip: Int!) {
        transactions(
          where: { from: $address }
          first: $limit
          skip: $skip
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          hash
          from
          to
          value
          gasPrice
          gasUsed
          timestamp
          blockNumber
        }
      }
    `;
    
    const variables = {
      address: address.toLowerCase(),
      limit,
      skip
    };
    
    try {
      const data = await request(GRAPH_API_URL, query, variables);
      return data.transactions;
    } catch (error) {
      console.error('Error fetching wallet transactions:', error);
      throw error;
    }
  }
  
  /**
   * Fetch token transfers for a specific wallet address
   * @param address Wallet address to fetch token transfers for
   * @param limit Number of transfers to fetch
   * @param skip Number of transfers to skip (for pagination)
   */
  async getTokenTransfers(address: string, limit: number = 100, skip: number = 0) {
    const query = gql`
      query GetTokenTransfers($address: String!, $limit: Int!, $skip: Int!) {
        transfers: erc20Transfers(
          where: { from: $address, OR: { to: $address } }
          first: $limit
          skip: $skip
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          from
          to
          value
          token {
            id
            symbol
            name
            decimals
          }
          blockNumber
          timestamp
          transaction {
            id
            hash
          }
        }
      }
    `;
    
    const variables = {
      address: address.toLowerCase(),
      limit,
      skip
    };
    
    try {
      const data = await request(GRAPH_API_URL, query, variables);
      return data.transfers;
    } catch (error) {
      console.error('Error fetching token transfers:', error);
      throw error;
    }
  }
  
  // Additional methods for other data types (swaps, liquidity, etc.) can be added here
}

export default new GraphQLService(); 