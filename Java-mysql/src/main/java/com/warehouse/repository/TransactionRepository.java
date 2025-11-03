package com.warehouse.repository;

import com.warehouse.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository cho Transaction
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByTransactionCode(String transactionCode);
    
    List<Transaction> findByMaterialId(Long materialId);
    
    List<Transaction> findByType(Transaction.TransactionType type);
    
    // Tìm giao dịch theo khoảng thời gian
    @Query("SELECT t FROM Transaction t WHERE t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Lấy lịch sử giao dịch theo nguyên liệu
    @Query("SELECT t FROM Transaction t WHERE t.material.id = :materialId ORDER BY t.transactionDate DESC")
    List<Transaction> findTransactionHistoryByMaterial(Long materialId);
    
    // Lấy giao dịch theo nhân viên
    List<Transaction> findByEmployeeIdOrderByTransactionDateDesc(Long employeeId);
}
