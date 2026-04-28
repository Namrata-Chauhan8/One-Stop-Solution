import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Layout from "../../components/layouts/Layout";
import { MyOrderData } from "../../data/MyOrderData";

const MyOrders = ({ navigation }) => {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statuses = [
    "All",
    "Delivered",
    "In Transit",
    "Processing",
    "Pending",
    "Cancelled",
  ];

  // Filter orders based on selected status
  const filteredOrders =
    selectedStatus === "All"
      ? MyOrderData
      : MyOrderData.filter((order) => order.status === selectedStatus);

  // Count orders by status
  const getStatusCount = (status) => {
    if (status === "All") return MyOrderData.length;
    return MyOrderData.filter((order) => order.status === status).length;
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#34C759";
      case "In Transit":
        return "#FF9500";
      case "Processing":
        return "#007AFF";
      case "Pending":
        return "#A2845E";
      case "Cancelled":
        return "#FF3B30";
      default:
        return "#667085";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "All":
        return "list";
      case "Delivered":
        return "check-circle";
      case "In Transit":
        return "local-shipping";
      case "Processing":
        return "schedule";
      case "Pending":
        return "hourglass-empty";
      case "Cancelled":
        return "cancel";
      default:
        return "help";
    }
  };

  const renderStatusFilter = () => (
    <View style={styles.filterSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.statusFilterContainer}
        contentContainerStyle={styles.filterContentContainer}
      >
        {statuses.map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.statusButtonActive,
            ]}
            onPress={() => setSelectedStatus(status)}
            activeOpacity={0.7}
          >
            <View style={styles.statusButtonContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={getStatusIcon(status)}
                  size={18}
                  color={
                    selectedStatus === status ? "#fff" : getStatusColor(status)
                  }
                />
              </View>
              <View style={styles.statusInfo}>
                <Text
                  style={[
                    styles.statusButtonText,
                    selectedStatus === status && styles.statusButtonTextActive,
                  ]}
                >
                  {status}
                </Text>
                <View style={styles.countBadge}>
                  <Text
                    style={[
                      styles.countBadgeText,
                      status === selectedStatus && { color: "#fff" },
                    ]}
                  >
                    {getStatusCount(status)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderOrderCard = ({ item }) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderId}>{item.orderId}</Text>
          <Text style={styles.orderDate}>
            <MaterialIcons name="calendar-today" size={12} color="#666" />{" "}
            {item.orderDate}
          </Text>
        </View>

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <MaterialIcons
            name={getStatusIcon(item.status)}
            size={14}
            color="#fff"
          />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Products Section */}
      <View style={styles.productsSection}>
        <Text style={styles.productsTitle}>Items ({item.products.length})</Text>
        {item.products.map((product, index) => (
          <View
            key={product._id}
            style={[
              styles.productItem,
              index < item.products.length - 1 && styles.productItemBorder,
            ]}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productQty}>Qty: {product.qty}</Text>
            </View>
            <Text style={styles.productPrice}>${product.price}</Text>
          </View>
        ))}
      </View>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Payment:</Text>
          <Text style={styles.summaryValue}>{item.paymentMode}</Text>
        </View>

        {item.deliveryDate && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivered:</Text>
            <Text style={styles.summaryValue}>{item.deliveryDate}</Text>
          </View>
        )}

        {item.expectedDelivery && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expected:</Text>
            <Text style={styles.summaryValue}>{item.expectedDelivery}</Text>
          </View>
        )}

        {item.cancelReason && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reason:</Text>
            <Text style={[styles.summaryValue, { color: "#FF3B30" }]}>
              {item.cancelReason}
            </Text>
          </View>
        )}
      </View>

      {/* Order Footer */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>{item.totalAmount}</Text>
        </View>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsButtonText}>View Details</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-bag" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Orders Found</Text>
      <Text style={styles.emptySubtitle}>
        You don't have any {selectedStatus.toLowerCase()} orders yet
      </Text>
      <TouchableOpacity style={styles.emptyButton}>
        <Text style={styles.emptyButtonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Layout scroll={false}>
      <View style={styles.container}>
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item._id.toString()}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={
            <View>
              {/* Header */}
              <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>My Orders</Text>
                <Text style={styles.headerSubtitle}>
                  {filteredOrders.length} order(s)
                </Text>
              </View>

              {/* Status Filter */}
              {renderStatusFilter()}
            </View>
          }
          ListEmptyComponent={renderEmptyState()}
        />
      </View>
    </Layout>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerSection: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  filterSection: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingVertical: 8,
  },
  statusFilterContainer: {
    paddingHorizontal: 12,
  },
  filterContentContainer: {
    paddingHorizontal: 3,
  },
  statusButton: {
    marginHorizontal: 6,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f8f8f8",
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    minWidth: 110,
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    elevation: 4,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    color: "#fff",
  },
  statusButtonContent: {
    alignItems: "center",
    width: "100%",
  },
  iconContainer: {
    marginBottom: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusInfo: {
    alignItems: "center",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  statusButtonTextActive: {
    color: "#fff",
  },
  countBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  orderHeaderLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  productsSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  productsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#666",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  productItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    paddingBottom: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  productQty: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#007AFF",
  },
  orderSummary: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  totalLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "600",
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#007AFF",
  },
  viewDetailsButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#007AFF",
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
