"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  User, 
  FileText,
  Building2,
  CreditCard,
  Globe
} from 'lucide-react';

interface DescriptionItem {
  id: string;
  language: 'vi' | 'en' | 'ko';
  content: string;
}

const languages = [
  { code: 'vi' as const, name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en' as const, name: 'English', flag: '🇺🇸' },
  { code: 'ko' as const, name: '한국어', flag: '🇰🇷' }
];

export default function ReceiptDetailPage() {
  const navigate = useNavigate();
  
  // Form data
  const [formData, setFormData] = useState({
    receiptNo: 'PT0001',
    transactionDate: '2025-01-04',
    amount: 1000000,
    receiverName: 'Nguyễn Văn A',
    customerCode: 'KH001',
    customerName: 'Công ty TNHH ABC',
    bankName: 'Vietcombank',
    email: 'customer@company.com',
    debit: '111',
    debitAccountName: 'Tiền mặt',
    credit: '131',
    creditAccountName: 'Phải thu khách hàng',
  });

  // Descriptions with multiple languages
  const [descriptions, setDescriptions] = useState<DescriptionItem[]>([
    { id: '1', language: 'vi', content: 'Thu tiền bán hàng khách hàng ABC' }
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState<'vi' | 'en' | 'ko'>('vi');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addDescription = () => {
    const newId = Date.now().toString();
    setDescriptions(prev => [
      ...prev,
      { id: newId, language: selectedLanguage, content: '' }
    ]);
  };

  const updateDescription = (id: string, field: 'language' | 'content', value: string) => {
    setDescriptions(prev => prev.map(desc => 
      desc.id === id ? { ...desc, [field]: value } : desc
    ));
  };

  const removeDescription = (id: string) => {
    setDescriptions(prev => prev.filter(desc => desc.id !== id));
  };

  const handleSave = () => {
    console.log('Saving receipt:', { ...formData, descriptions });
    alert('Đã lưu phiếu thu thành công!');
    navigate('/receipt');
  };

  const handleBack = () => {
    navigate('/receipt');
  };

  return (
    <div className="w-full mx-auto text-[13px]">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Quay lại"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chi tiết phiếu thu</h1>
              <p className="text-gray-600 mt-1">Thêm mới hoặc chỉnh sửa thông tin phiếu thu</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Lưu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Thông tin cơ bản */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Thông tin cơ bản
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số chứng từ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.receiptNo}
                onChange={(e) => handleInputChange('receiptNo', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Nhập số chứng từ"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày giao dịch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange('transactionDate', e.target.value)}
                  className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số tiền <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', Number(e.target.value))}
                  className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Nhập số tiền"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người nhận tiền <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={formData.receiverName}
                  onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Nhập tên người nhận"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả đa ngôn ngữ */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-600" />
                Mô tả đa ngôn ngữ
              </h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'vi' | 'en' | 'ko')}
                  className="border border-gray-300 rounded-md px-3 py-1 text-[13px] focus:outline-none focus:border-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addDescription}
                  className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  title="Thêm mô tả"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {descriptions.map((desc, index) => (
                <div key={desc.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">
                        Mô tả {index + 1}
                      </span>
                      <select
                        value={desc.language}
                        onChange={(e) => updateDescription(desc.id, 'language', e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {descriptions.length > 1 && (
                      <button
                        onClick={() => removeDescription(desc.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa mô tả"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={desc.content}
                    onChange={(e) => updateDescription(desc.id, 'content', e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                    rows={3}
                    placeholder={`Nhập mô tả bằng ${languages.find(l => l.code === desc.language)?.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-purple-600" />
            Thông tin khách hàng
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã khách hàng
              </label>
              <input
                type="text"
                value={formData.customerCode}
                onChange={(e) => handleInputChange('customerCode', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Nhập mã khách hàng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên khách hàng
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Nhập tên khách hàng"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên ngân hàng
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Nhập tên ngân hàng"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Nhập email"
              />
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
            Thông tin tài khoản
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TK Nợ
                </label>
                <input
                  type="text"
                  value={formData.debit}
                  onChange={(e) => handleInputChange('debit', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Số TK nợ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TK Có
                </label>
                <input
                  type="text"
                  value={formData.credit}
                  onChange={(e) => handleInputChange('credit', e.target.value)}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                  placeholder="Số TK có"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản nợ
              </label>
              <input
                type="text"
                value={formData.debitAccountName}
                onChange={(e) => handleInputChange('debitAccountName', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Tên tài khoản nợ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên tài khoản có
              </label>
              <input
                type="text"
                value={formData.creditAccountName}
                onChange={(e) => handleInputChange('creditAccountName', e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Tên tài khoản có"
              />
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin bổ sung
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]">
                <option value="draft">Bản nháp</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="locked">Đã khóa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                File đính kèm
              </label>
              <input
                type="file"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú
              </label>
              <textarea
                rows={4}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 border-gray-300 transition-colors text-[13px]"
                placeholder="Nhập ghi chú bổ sung"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Tóm tắt phiếu thu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Số chứng từ</div>
            <div className="text-xl font-bold text-blue-700">{formData.receiptNo}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Số tiền</div>
            <div className="text-xl font-bold text-green-700">
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(formData.amount)}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Người nhận</div>
            <div className="text-xl font-bold text-purple-700">{formData.receiverName}</div>
          </div>
        </div>
        
        {/* Descriptions Summary */}
        {descriptions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-3">Mô tả theo ngôn ngữ:</h3>
            <div className="space-y-2">
              {descriptions.map((desc, index) => (
                <div key={desc.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg">
                    {languages.find(l => l.code === desc.language)?.flag}
                  </span>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      {languages.find(l => l.code === desc.language)?.name}
                    </div>
                    <div className="text-sm text-gray-900">
                      {desc.content || <em className="text-gray-400">Chưa có nội dung</em>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}