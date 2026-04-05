import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import API_BASE_URL from "../config/api";

class ApiService {
    private axios: AxiosInstance;

    constructor() {
        this.axios = this.axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                "Content-Type": "application/json",
            },
        });

        //Response Interceptor
        this.axios.interceptors.response.use(
            (response: AxiosResponse) => {
                return response;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );
    }

    //Generic GET Request
    public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axios.get<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Generic POST Request
    public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axios.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Generic PUT Request
    public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axios.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Generic PATCH Request
    public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axios.patch<T>(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Generic DELETE Request
    public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axios.delete<T>(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ApiService();

