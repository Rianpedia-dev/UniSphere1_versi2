// Fungsi untuk menghapus pengaduan
export const deleteComplaintById = async (complaintId, userId) => {
  try {
    // Validasi input
    if (!complaintId) {
      throw new Error('ID pengaduan tidak boleh kosong');
    }
    
    if (!userId) {
      throw new Error('ID pengguna tidak boleh kosong');
    }
    
    // Panggil API untuk menghapus pengaduan
    const response = await fetch(`/api/complaints/${complaintId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ user_id: userId })
    });
    
    // Cek respon
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal menghapus pengaduan');
    }
    
    // Jika berhasil, kembalikan data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};