package com.warehouse.repository;

import com.warehouse.entity.MaterialRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho MaterialRequest
 */
@Repository
public interface MaterialRequestRepository extends JpaRepository<MaterialRequest, Long> {
    
    Optional<MaterialRequest> findByRequestCode(String requestCode);
    
    List<MaterialRequest> findByStatus(MaterialRequest.RequestStatus status);
    
    List<MaterialRequest> findByRequesterId(Long requesterId);
    
    List<MaterialRequest> findByMaterialId(Long materialId);
    
    // Tìm yêu cầu chờ xử lý
    @Query("SELECT mr FROM MaterialRequest mr WHERE mr.status = 'PENDING' ORDER BY mr.createdAt ASC")
    List<MaterialRequest> findPendingRequests();
    
    // Tìm yêu cầu theo người phê duyệt
    List<MaterialRequest> findByApproverId(Long approverId);
}
